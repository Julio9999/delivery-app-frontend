# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Product CRUD integration

The admin panel now includes a simple interface for managing products using the backend API.

### 📦 New dependencies

Run one of the following in the `panel-administrativo/panel-administrativo` folder:

```bash
# using bun
bun add react-router-dom axios
bun add -d @types/react-router-dom

# or npm / yarn
npm install react-router-dom axios
npm install -D @types/react-router-dom
``` 

### ⚙️ Environment variable

Create a `.env` file with the base URL of the backend, for example:

```
VITE_API_URL=http://localhost:3000
```

(you can change the port if your Nest service runs elsewhere)

### 🧱 Structure

- `src/api/client.ts` — axios instance configured with the API base URL
- `src/api/products/products.ts` — helper functions that call `/products` endpoints
- `src/modules/products/schemas/schemas.ts` — product form schema and types
- `src/modules/products/hooks/use-product-form.ts` — custom hook for create/update logic
- `src/modules/products/components/product-form.tsx` — reusable form component
- `src/pages/products/main-products-page.tsx` — product list table with edit/delete (now uses `DeleteModal` and `refreshKey` on `DataTable`)
- `src/pages/products/create-product.tsx` & `src/pages/products/edit-product.tsx` — pages that wrap the form component

> El código reside en `src/` (el subdirectorio `panel-administrativo/` se eliminó tras la reestructuración).
Routes are mounted automatically under `/products`.

Start the backend and run `npm run dev` (or `bun dev`) to test the CRUD UI.

## Build info

The sidebar displays a build-version badge showing `v{semver} ({short SHA}) - {ISO timestamp}`. The short SHA (7 chars) is shown in the badge; hover the badge to see the full 40-char SHA in a tooltip.

The version comes from `package.json`, the git SHA is read from the local repo at build time via `git rev-parse --short HEAD` (or from the `GIT_SHA` Docker build-arg injected by the CI workflow), and the timestamp is captured when the Vite config is evaluated. If git is unavailable during the build (e.g., in a stripped CI container without the build-arg), the SHA portion shows `unknown`. The constant is injected at build time, not at runtime.

