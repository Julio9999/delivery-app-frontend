import { Routes, Route } from 'react-router';

import ProtectedLayout from './components/layouts/protected-layout';

import { CreateProductPage, EditProductPage, MainPage } from './pages/products';
import { LoginPage } from './pages/auth';
import { MainCategoriesPage, CreateCategoryPage, EditCategoryPage } from './pages/category';
import { MainOffersPage, CreateOfferPage, EditOfferPage } from './pages/offers';

function App() {
  return (
    <Routes>
      <Route element={<ProtectedLayout />}>
        <Route path="/products" element={<MainPage />} />
        <Route path="/products/create" element={<CreateProductPage />} />
        <Route path="/products/:id" element={<EditProductPage />} />

        <Route path="/categories" element={<MainCategoriesPage />} />
        <Route path="/categories/create" element={<CreateCategoryPage />} />
        <Route path="/categories/:id" element={<EditCategoryPage />} />

        <Route path="/offers" element={<MainOffersPage />} />
        <Route path="/offers/create" element={<CreateOfferPage />} />
        <Route path="/offers/:id" element={<EditOfferPage />} />

        <Route path="/*" element={<MainPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
