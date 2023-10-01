import { API_URL } from '../utils';

export const apiRoutes = {
  login: `${API_URL}/account/sign-in`,

  register: `${API_URL}/account/sign-up`,

  logout: `${API_URL}/logout`,

  verify: `${API_URL}/account/verify`,

  user: `${API_URL}/user`,

  reviews: `${API_URL}/unknown`,

  orderHistories: `${API_URL}/seller/product-transaction`,

  products: `${API_URL}/public/product`,

  productTransaction: `${API_URL}/product-transaction`,

  stores: `${API_URL}/seller/store`,

  categories: `${API_URL}/seller/product-category`,

  maps : `${API_URL}/public/map`,

  payment : `${API_URL}/payment`,
};
