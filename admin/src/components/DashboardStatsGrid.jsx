import React, { useEffect, useState, useCallback } from "react";
import { IoBagHandle, IoPeople, IoCart } from "react-icons/io5";
import { RiAdminFill } from "react-icons/ri";
import { getAllProduct } from "../services/product";
import { getAllUser } from "../services/user";
function DashboardStatsGrid() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [countProduct, setCountProduct] = useState(0);
  const getUsers = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getAllUser();

      if (result.error) throw new Error(result.error);
      else setUsers(result.data.users);
    } catch (err) {
      console.log("Error: ", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getProductCount = useCallback(async () => {
    try {
      const products = await getAllProduct();
      setCountProduct(products.data.countProduct);
      console.log(countProduct);
    } catch (error) {
      console.error("Error fetching product count:", error);
    }
  }, []);

  useEffect(() => {
    getUsers();
    getProductCount();
  }, [getUsers, getProductCount]);

  // Đếm số lượng người dùng theo vai trò
  const adminCount = users
    ? users.filter((user) => user.role === "admin").length
    : 0;
  const customerCount = users
    ? users.filter((user) => user.role === "customer").length
    : 0;

  return (
    <div className="flex gap-4 w-full" loading={loading}>
      <BoxWrapper>
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-500">
          <IoBagHandle className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">
            Total Product
          </span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              {countProduct}
            </strong>
            <span className="text-sm text-green-500 pl-2">+{countProduct}</span>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-orange-600">
          <RiAdminFill className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">Total Admin</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              {adminCount}
            </strong>
            <span className="text-sm text-green-500 pl-2">+{adminCount}</span>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-yellow-400">
          <IoPeople className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">
            Total Customer
          </span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              {customerCount}
            </strong>
            <span className="text-sm text-green-500 pl-2">
              +{customerCount}
            </span>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-600">
          <IoCart className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">Total Orders</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">655</strong>
            <span className="text-sm text-green-500 pl-2">+43</span>
          </div>
        </div>
      </BoxWrapper>
    </div>
  );
}

export default DashboardStatsGrid;

function BoxWrapper({ children }) {
  return (
    <div className="bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center">
      {children}
    </div>
  );
}
