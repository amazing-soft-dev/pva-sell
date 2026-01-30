import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { INITIAL_PRODUCTS } from './seedData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware: Log all requests to console for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Allow CORS
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// --- In-Memory Fallback Store ---
let memoryUsers = [];
let memoryOrders = [];

// --- MongoDB Connection ---
let isMongoConnected = false;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pva-markets')
  .then(() => {
    console.log('MongoDB Connected');
    isMongoConnected = true;
    seedProducts();
  })
  .catch(err => {
    console.warn('MongoDB Connection Failed, switching to in-memory mode:', err.message);
    isMongoConnected = false;
  });

// --- Schemas & Models ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  title: String,
  category: String,
  price: Number,
  stock: Number,
  icon: String,
  description: String,
  features: [String]
});

const orderSchema = new mongoose.Schema({
  userId: String,
  guestEmail: String,
  items: [{
    productId: String,
    title: String,
    quantity: Number,
    price: Number
  }],
  total: Number,
  status: { type: String, default: 'pending' }, // pending, processing, shipped, completed
  date: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

// --- Seeder ---
const seedProducts = async () => {
  if (!isMongoConnected) return;
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(INITIAL_PRODUCTS);
      console.log('Database seeded with initial products');
    }
  } catch (err) {
    console.error('Seeding error:', err);
  }
};

// --- Helper: Telegram Notification ---
const sendTelegramNotification = async (message) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId || chatId === 'your_chat_id_here') {
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });
  } catch (err) {
    console.error('Telegram notification error:', err);
  }
};

// --- Routes ---

app.get('/', (req, res) => {
    res.send('Credexus Market API is Running');
});

// 1. Auth
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (isMongoConnected) {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: 'User already exists' });

      user = new User({ name, email, password: hashedPassword });
      await user.save();

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'default', { expiresIn: '7d' });
      res.json({ token, user: { id: user._id, name, email } });
    } else {
      if (memoryUsers.find(u => u.email === email)) return res.status(400).json({ message: 'User exists' });
      const newUser = { _id: Date.now().toString(), name, email, password: hashedPassword };
      memoryUsers.push(newUser);
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || 'default', { expiresIn: '7d' });
      res.json({ token, user: { id: newUser._id, name, email } });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user;
    if (isMongoConnected) {
      user = await User.findOne({ email });
    } else {
      user = memoryUsers.find(u => u.email === email);
    }

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id || user._id }, process.env.JWT_SECRET || 'default', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id || user._id, name: user.name, email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 2. Admin Routes
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  if (password === adminPass) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'default', { expiresIn: '1d' });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ message: 'Invalid admin password' });
  }
});

app.get('/api/admin/orders', async (req, res) => {
  try {
    if (isMongoConnected) {
      const orders = await Order.find().sort({ date: -1 });
      const formatted = orders.map(o => ({ ...o._doc, id: o._id.toString() }));
      res.json(formatted);
    } else {
      const formatted = memoryOrders.map(o => ({ ...o, id: o._id }));
      res.json(formatted);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

app.put('/api/admin/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (isMongoConnected) {
      const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
      res.json({ ...order._doc, id: order._id.toString() });
    } else {
      const orderIndex = memoryOrders.findIndex(o => o._id === id);
      if (orderIndex > -1) {
        memoryOrders[orderIndex].status = status;
        res.json({ ...memoryOrders[orderIndex], id });
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    }
  } catch (err) {
    res.status(500).json({ message: 'Error updating order' });
  }
});

// 3. Products
app.get('/api/products', async (req, res) => {
  try {
    if (isMongoConnected) {
      const products = await Product.find();
      const formatted = products.map(p => ({ ...p._doc, id: p._id.toString() }));
      res.json(formatted);
    } else {
      const formatted = INITIAL_PRODUCTS.map((p, i) => ({ ...p, id: `local-${i}` }));
      res.json(formatted);
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 4. Orders
app.post('/api/orders', async (req, res) => {
  try {
    const { userId, guestEmail, items, total } = req.body;
    
    let newOrderData = { userId, guestEmail, items, total, status: 'pending', date: new Date() };
    let savedOrder;

    if (isMongoConnected) {
      const newOrder = new Order(newOrderData);
      await newOrder.save();
      savedOrder = { ...newOrder._doc, id: newOrder._id.toString() };
    } else {
      newOrderData._id = Date.now().toString();
      memoryOrders.push(newOrderData);
      savedOrder = { ...newOrderData, id: newOrderData._id };
    }

    // Notify
    let customer = guestEmail;
    if (!customer && userId) {
        if (isMongoConnected) {
            const user = await User.findById(userId);
            if (user) customer = user.email;
        } else {
            const user = memoryUsers.find(u => u._id === userId);
            if (user) customer = user.email;
        }
    }
    customer = customer || 'Unknown User';
    const itemsList = items.map(i => `${i.quantity}x ${i.title}`).join(', ');
    const message = `🎉 NEW ORDER! ID: ${savedOrder.id}, Customer: ${customer}, Total: $${total.toFixed(2)}`;
    sendTelegramNotification(message);

    res.json(savedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const { userId, email } = req.query;
    if (isMongoConnected) {
      let query = {};
      if (userId && email) query = { $or: [{ userId }, { guestEmail: email }] };
      else if (userId) query = { userId };
      else if (email) query = { guestEmail: email };
      else return res.json([]);
      const orders = await Order.find(query).sort({ date: -1 });
      res.json(orders.map(o => ({ ...o._doc, id: o._id.toString() })));
    } else {
      const orders = memoryOrders.filter(o => (userId && o.userId === userId) || (email && o.guestEmail === email));
      res.json(orders.map(o => ({ ...o, id: o._id })));
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 5. Chatbot
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) return res.json({ text: "I'm sorry, I'm currently offline (Server API Key missing)." });

    const messages = [
        { role: "system", content: "You are the helpful AI support agent for Credexus Market." },
        ...history,
        { role: "user", content: message }
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "arcee-ai/trinity-large-preview:free",
        messages: messages
      })
    });

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
        res.json({ text: data.choices[0].message.content });
    } else {
        res.status(500).json({ message: "No response from AI provider" });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to generate chat response" });
  }
});

// Handle 404 for API routes so we return JSON instead of HTML
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API Endpoint Not Found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});