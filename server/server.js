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

app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

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
  status: { type: String, default: 'pending' },
  date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

// --- Seeder ---
const seedProducts = async () => {
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
seedProducts();

// --- Middleware ---
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ message: 'Token is not valid' });
  }
};

// --- Routes ---

// 1. Auth
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name, email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 2. Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    // Map _id to id for frontend compatibility
    const formatted = products.map(p => ({ ...p._doc, id: p._id.toString() }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 3. Orders
app.post('/api/orders', async (req, res) => {
  try {
    const { userId, guestEmail, items, total } = req.body;
    const newOrder = new Order({ userId, guestEmail, items, total, status: 'completed' });
    await newOrder.save();
    res.json({ ...newOrder._doc, id: newOrder._id.toString() });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const { userId, email } = req.query;
    let query = {};
    if (userId && email) {
      query = { $or: [{ userId }, { guestEmail: email }] };
    } else if (userId) {
      query = { userId };
    } else if (email) {
      query = { guestEmail: email };
    } else {
        return res.json([]);
    }
    
    const orders = await Order.find(query).sort({ date: -1 });
    const formatted = orders.map(o => ({ ...o._doc, id: o._id.toString() }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 4. Chatbot (OpenRouter)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    const messages = [
        { 
            role: "system", 
            content: `You are the helpful AI support agent for Credexus Market. 
            We sell verified PVA (Personal Verified Accounts) for social media (LinkedIn, etc), payments (PayPal, etc), and freelancing (Upwork).
            Instant delivery, 3-day warranty, 24/7 support.
            Current date: ${new Date().toLocaleDateString()}.
            If you don't know the specific price of an item, ask them to check the Products page.` 
        },
        ...history,
        { role: "user", content: message }
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
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
    console.error("Chat Error:", err);
    res.status(500).json({ message: "Failed to generate chat response" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
