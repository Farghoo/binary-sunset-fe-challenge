interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_USE_MOCK_DATA: string;

  readonly DEV: boolean; // true in development, false in production
  readonly PROD: boolean; // true in production, false in development
  readonly MODE: string; // 'development' | 'production' | custom
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
