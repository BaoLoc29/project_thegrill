import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import Layout from "./components/shared/Layout";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import NonAuthLayout from "./layouts/NonAuthLayout/index.jsx";
import AuthLayout from "./layouts/AuthLayout/index.jsx";
import isObjctEmpty from "./utils/isObjectEmpty";
import Products from "./components/Products.jsx";
import Employees from "./components/Employees.jsx";
import Orders from "./components/Orders.jsx";
import Customers from "./components/Customers.jsx";
import Profile from "./components/Profile.jsx";
import Categories from "./components/Categories.jsx";
function App() {
  const user = useSelector((state) => state.users.user);
  return (
    <>
      <Toaster />
      <Routes>
        {isObjctEmpty(user) ? (
          <Route path="/" element={<NonAuthLayout />}>
            <Route index element={<Login />} />
          </Route>
        ) : (
          <Route path="/" element={<AuthLayout />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="employees" element={<Employees />} />
              <Route path="orders" element={<Orders />} />
              <Route path="customers" element={<Customers />} />
              <Route path="my-profile" element={<Profile />} />
              <Route path="categories" element={<Categories />} />
            </Route>
          </Route>
        )}
      </Routes>
    </>
  );
}

export default App;
