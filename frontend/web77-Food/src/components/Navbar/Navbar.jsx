import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "./../../assets/assets";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import {
  removeTokenFromLocalStorage,
  removeUserFromLocalStorage,
} from "../../utils/localstorage";

import { HiOutlineSearch } from "react-icons/hi";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("menu");
  const { getTotalCartAmount } = useContext(StoreContext);
  const token = localStorage.getItem("accessToken");

  const handleLogout = () => {
    // Xóa accessToken và user khỏi Local Storage
    removeTokenFromLocalStorage();
    removeUserFromLocalStorage();
    window.location.reload();
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.thegrill} alt="logo-thegrill" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          Home
        </Link>
        <a
          href="#explore-menu"
          onClick={() => setMenu("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          Menu
        </a>
        <a
          href="#app-download"
          onClick={() => setMenu("mobile-app")}
          className={menu === "mobile-app" ? "active" : ""}
        >
          Mobile-App
        </a>
        <a
          href="#footer"
          onClick={() => setMenu("contact-us")}
          className={menu === "contact-us" ? "active" : ""}
        >
          Contact Us
        </a>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        {/* <div class="nav-search">
          <input type="text" placeholder="Search..." class="input-search" />
          <img src={assets.search_icon} alt="" width={25} class="search-icon" />
        </div> */}

        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              <li>
                <img src={assets.bag_icon} alt="" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={handleLogout}>
                <img src={assets.logout_icon} alt="" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
