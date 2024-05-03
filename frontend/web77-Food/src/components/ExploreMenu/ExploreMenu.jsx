import React, { useState, useEffect } from "react";
import "./ExploreMenu.css";
import { getAllCategory } from "../../services/category";

const ExploreMenu = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategory();
        console.log("API response:", response); 
        if (response && response.data.result) {
          setCategories(response.data.result);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (item) => {
    setSelectedCategory(prev => prev === item.menu_name ? null : item.menu_name);
  };

  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore our menu</h1>
      <p className="explore-menu-test">
        Choose from a diverse menu featuring a delectable array of dishes. Our
        mission is to satisfy your cravings and elevate your dining experience,
        one delicious meal at a time.
      </p>
      <div className="explore-menu-list">
        {categories.map((category, index) => (
          <div
            onClick={() => handleCategoryClick(category)}
            key={index}
            className={`explore-menu-list-item ${selectedCategory === category.menu_name ? 'selected' : ''}`}
          >
            <img src={category.image} alt="" />
            <p>{category.name}</p>
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
