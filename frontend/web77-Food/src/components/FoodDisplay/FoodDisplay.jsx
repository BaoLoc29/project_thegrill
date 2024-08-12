import React, { useState, useEffect } from "react";
import "./FoodDisplay.css";
import { getAllProduct } from "../../services/product";
import FoodItem from "../FoodItem/FoodItem"; // Import FoodItem

const FoodDisplay = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllProductsFromAPI();
  }, []);

  const getAllProductsFromAPI = async () => {
    try {
      const response = await getAllProduct();
      console.log("API response:", response);
      if (response && response.data && response.data.result) {
        setProducts(response.data.result);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {products.map((product) => (
          <FoodItem
            key={product.id}
            id={product._id}
            name={product.name}
            description={product.description}
            price={product.price}
            image={product.image}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodDisplay;