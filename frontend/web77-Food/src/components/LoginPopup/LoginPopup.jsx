import React, { useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import {
  saveTokenToLocalStorage,
  saveUserToLocalStorage,
} from "../../utils/localstorage";
import { login, signUp } from "../../services/user";
import toast from "react-hot-toast";

const LoginPopup = ({ setShowLogin }) => {
  const [currState, setCurrState] = useState("Login");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError("");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setError("");
    setPasswordMatch(e.target.value === password);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    setError("");
  };

  const handleAgeChange = (e) => {
    setAge(e.target.value);
    setError("");
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
    setError("");
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (currState === "Login") {
        if (!email || !password) {
          setError("Please fill in all fields");
          return;
        }

        const response = await login({ email, password });
        const { accessToken, user } = response.data;

        saveTokenToLocalStorage(accessToken);
        saveUserToLocalStorage(user);

        toast.success("Login successful");
        setShowLogin(false);
      } else {
        if (
          !email ||
          !password ||
          !confirmPassword ||
          !name ||
          !age ||
          !phoneNumber ||
          !address ||
          !passwordMatch
        ) {
          setError("Please fill in all fields");
          return;
        }

        if (password !== confirmPassword) {
          setError("Passwords do not match");
          return;
        }

        const response = await signUp({
          name,
          email,
          password,
          age,
          phoneNumber,
          address,
        });
        toast.success(response.data.message);
        setCurrState("Login");
        resetForm();
      }
    } catch (error) {
      // Kiểm tra xem lỗi có phải là do Joi không
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to login or sign up");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setAge("");
    setPhoneNumber("");
    setAddress("");
    setError("");
    setPasswordMatch(true);
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={handleSubmit}>
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Login" ? null : (
            <>
              <input
                type="text"
                placeholder="Your name"
                required
                value={name}
                onChange={handleNameChange}
              />
              <input
                type="text"
                placeholder="Your age"
                required
                value={age}
                onChange={handleAgeChange}
              />
              <input
                type="text"
                placeholder="Your phone"
                required
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
              />
              <input
                type="text"
                placeholder="Your address"
                required
                value={address}
                onChange={handleAddressChange}
              />
            </>
          )}
          <input
            type="email"
            placeholder="Your email"
            required
            value={email}
            onChange={handleEmailChange}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={handlePasswordChange}
          />

          {currState === "Login" ? null : (
            <input
              type="password"
              placeholder="Confirm password"
              required
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          )}
          {error && <p className="error-message">{error}</p>}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : currState}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
