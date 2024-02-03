import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login';
import HomeLayout from './pages/HomeLayout';
import Register from './pages/Register';
import Landing from './pages/Landing';

import { action as registerAction } from './pages/Register';
import { action as loginAction } from './pages/Login';
import Checkout from './pages/Checkout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <h1>ERROR</h1>,
    children: [
      { index: true, element: <Landing /> },
      { path: 'register', element: <Register />, action: registerAction },
      { path: 'login', element: <Login />, action: loginAction },
      { path: 'shop', element: <h1>Products</h1> },
      { path: 'cart', element: <h1>Cart</h1> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'thankyou', element: <h1>ThankYou</h1> },
      { path: 'profile', element: <h1>Profile</h1> },
      { path: 'password-forgot', element: <h1>ForgotPassword</h1> },
      { path: 'password-reset/:token', element: <h1>ResetPassword</h1> },
      {
        path: 'dashboard',
        element: <h1>DashboardLayout</h1>,
        loader: '',
        children: [
          {
            index: true,
            element: <h1>Dashboard Index</h1>,
          },
          {
            path: 'products',
            element: <h1>Products List</h1>,
            errorElement: <h3>ERROR</h3>,
          },
          {
            path: 'new-product',
            element: <h1>Create Product</h1>,
          },
          {
            path: 'users',
            element: <h1>Users List</h1>,
            errorElement: <h3>ERROR</h3>,
          },
          {
            path: 'user/:id',
            element: <h1>User</h1>,
            errorElement: <h3>ERROR</h3>,
          },
          {
            path: 'orders',
            element: <h1>Orders List</h1>,
            errorElement: <h3>ERROR</h3>,
          },
          {
            path: 'order/:id',
            element: <h1>Order</h1>,
            errorElement: <h3>ERROR</h3>,
          },
          {
            path: 'profile',
            element: <h1>Admin Profile</h1>,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
