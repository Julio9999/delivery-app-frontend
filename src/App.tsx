import { Routes, Route } from 'react-router';

import ProtectedLayout from './components/layouts/protected-layout';

import { CreateProductPage, EditProductPage, MainPage } from './pages/products';
import { LoginPage } from './pages/auth';
import { MainCategoriesPage, CreateCategoryPage, EditCategoryPage } from './pages/category';

function App() {
  return (
    <Routes>
      <Route element={<ProtectedLayout />}>
        <Route path="/products" element={<MainPage />} />
        <Route path="/products/create" element={<CreateProductPage />} />
        <Route path="/products/:id" element={<EditProductPage />} />
        <Route path="/categories" element={<MainCategoriesPage />} />
        <Route path="/categories/new" element={<CreateCategoryPage />} />
        <Route path="/categories/:id" element={<EditCategoryPage />} />
        <Route path="/*" element={<MainPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
