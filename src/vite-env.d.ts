/// <reference types="vite/client" />

interface ImportMetaEnv {
  // App-specific env vars (prefix VITE_ to expose to browser)
  readonly VITE_API_BASE_URL: string;
  readonly VITE_USE_MOCK_DATA: string;

  // Built-in Vite env vars — do not remove
  readonly DEV: boolean; // true in development, false in production
  readonly PROD: boolean; // true in production, false in development
  readonly MODE: string; // 'development' | 'production' | custom
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
