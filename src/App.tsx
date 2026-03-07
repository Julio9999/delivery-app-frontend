import { Routes, Route } from 'react-router';
import {
  CreateProductPage,
  EditProductPage,
  LoginPage,
  MainPage,
  MainCategoriesPage,
  CreateCategoryPage,
  EditCategoryPage,
} from './pages';
import Layout from './components/Layout';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}> 
        <Route path="/products" element={<MainPage />} />
        <Route path="/products/new" element={<CreateProductPage />} />
        <Route path="/products/:id/edit" element={<EditProductPage />} />
        <Route path="/categories" element={<MainCategoriesPage />} />
        <Route path="/categories/new" element={<CreateCategoryPage />} />
        <Route path="/categories/:id/edit" element={<EditCategoryPage />} />
        <Route path="/*" element={<MainPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
