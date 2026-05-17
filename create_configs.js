import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('.');

const clientPackageJson = {
  name: "coding-platform-client",
  private: true,
  version: "0.0.0",
  type: "module",
  scripts: {
    dev: "vite --port 5173",
    build: "vite build",
    lint: "eslint .",
    preview: "vite preview"
  },
  dependencies: {
    "@fontsource-variable/geist": "^5.2.9",
    "@monaco-editor/react": "^4.7.0",
    "@tailwindcss/vite": "^4.3.0",
    "axios": "^1.16.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "framer-motion": "^12.38.0",
    "lucide-react": "^1.16.0",
    "radix-ui": "^1.4.3",
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "react-router-dom": "^7.15.1",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.6.0",
    "tailwindcss": "^4.3.0",
    "tw-animate-css": "^1.4.0"
  },
  devDependencies: {
    "@eslint/js": "^10.0.1",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "eslint": "^10.3.0",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.6.0",
    "vite": "^8.0.12"
  }
};

const adminPackageJson = {
  ...clientPackageJson,
  name: "coding-platform-admin",
  scripts: {
    dev: "vite --port 5174",
    build: "vite build",
    lint: "eslint .",
    preview: "vite preview"
  },
  dependencies: {
    ...clientPackageJson.dependencies,
    "recharts": "^3.8.1",
  }
};

const viteConfig = `import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
`;

const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CodeArena</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`;

const eslintConfig = `import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
`;

const jsConfig = `{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
`;

const componentsJson = `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": false,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "zinc",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/utils/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
`;

const clientAppJsx = `import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import FrontendRoutes from "@/pages/FrontendRoutes";
import { Toaster } from "sonner";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Routes>
            <Route path="/*" element={<FrontendRoutes />} />
          </Routes>
          <Toaster richColors position="top-center" />
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
`;

const adminAppJsx = `import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { AdminRoute } from "@/components/ProtectedRoute";
import AdminRoutes from "@/routes/AdminRoutes";
import { Toaster } from "sonner";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Routes>
            <Route path="/*" element={<AdminRoute><AdminRoutes /></AdminRoute>} />
          </Routes>
          <Toaster richColors position="top-center" />
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
`;

const mainJsx = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "@fontsource-variable/geist"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`;

function setupApp(appName, pkg, appJsx) {
  const dir = path.join(ROOT, appName);
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2));
  fs.writeFileSync(path.join(dir, 'vite.config.js'), viteConfig);
  fs.writeFileSync(path.join(dir, 'index.html'), indexHtml);
  fs.writeFileSync(path.join(dir, 'eslint.config.js'), eslintConfig);
  fs.writeFileSync(path.join(dir, 'jsconfig.json'), jsConfig);
  fs.writeFileSync(path.join(dir, 'components.json'), componentsJson);
  fs.writeFileSync(path.join(dir, 'src', 'App.jsx'), appJsx);
  fs.writeFileSync(path.join(dir, 'src', 'main.jsx'), mainJsx);
  console.log("✅ " + appName + " configuration created.");
}

setupApp('client', clientPackageJson, clientAppJsx);
setupApp('admin', adminPackageJson, adminAppJsx);

console.log('Done!');
