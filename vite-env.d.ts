// Manual definitions for Vite environment variables to fix the 'Cannot find type definition file for vite/client' error
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __API_URL__: string;