import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import RestaurantSearch from "./RestaurantSearch";
import { FaUserShield } from "react-icons/fa";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap"; // Import Bootstrap Dropdown
import { BsEye, BsEyeSlash } from "react-icons/bs"; // Import Bootstrap icons
import { useNavigate } from "react-router-dom";
import "../App.css"; // Import your CSS file

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userEmail: "",
    userPassword: "",
    fullName: "",
    address: "",
    phoneNumber: "",
    confirmPassword: "",
  });
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Invalid user data in localStorage:", error);
      }
    }
  }, []);

  const toggleModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      setFormData({
        userEmail: "",
        userPassword: "",
        fullName: "",
        address: "",
        phoneNumber: "",
        confirmPassword: "",
      });
      setErrors({});
    }
  };

  const toggleForm = () => {
    setIsLoginMode(!isLoginMode);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";
    const emailRegex =
      /^[a-zA-Z][a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[6789][0-9]{9}$/;

    switch (name) {
      case "userEmail":
        if (!value.trim()) {
          error = "Email is required.";
        } else if (!emailRegex.test(value)) {
          error = "Enter a valid email.";
        }
        break;

      case "userPassword":
        if (!value) {
          error = "Password is required.";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters.";
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
          error = "Password must contain at least one special character.";
        }
        break;
      case "fullName":
        if (!value.trim()) {
          error = "Full Name is required.";
        } else if (!/^[a-zA-Z ]{3,}$/.test(value)) {
          error =
            "Invalid Full Name, only letters and spaces";
        }
        break;

      case "address":
        if (!value.trim() || value.length < 10) {
          error = "Address must be at least 10 characters.";
        }
        break;

      case "phoneNumber":
        if (!value.trim()) {
          error = "Phone number is required.";
        } else if (!phoneRegex.test(value)) {
          error =
            "Enter a valid 10-digit phone number";
        }
        break;

      case "confirmPassword":
        if (!value.trim()) {
          error = "Confirm Password is required.";
        } else if (value !== formData.userPassword) {
          error = "Passwords do not match.";
        }
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const validateForm = () => {
    let valid = true;
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
      if (errors[key]) valid = false;
    });
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
      let response;
      if (isLoginMode) {
        response = await axios.post("http://localhost:8080/api/users/login", {
          userEmail: formData.userEmail,
          userPassword: formData.userPassword,
        });
      } else {
        response = await axios.post(
          "http://localhost:8080/api/users/register",
          formData
        );
      }

      if (response.data?.token && response.data?.user) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setUser(response.data.user);
      }

      alert(isLoginMode ? "Login Successful!" : "Registration Successful!");
      toggleModal();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const handleMyOrders = () => {
    window.open("/my-orders", "_blank");
  };

  const handleMyFavorites = () => {
    window.open("/favorites", "_blank");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{
        backgroundImage:
          "url(https://th.bing.com/th/id/OIG1.UunApMX7JmqWl32CiErC?w=1792&h=1024&rs=1&pid=ImgDetMain)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "500px",
        opacity: 0.9,
      }}
    >
      <img
        src="./foodie.jpg"
        style={{
          borderRadius: "50%",
          width: "80px",
          height: "80px",
          position: "absolute",
          top: "10px",
          left: "10px",
        }}
      />
      <div
        className="container-fluid d-flex flex-column justify-content-center align-items-center text-center"
        style={{ height: "100%" }}
      >
        <p className="text-white fw-bold fs-1 mb-3">Foodie</p>
        <p className="text-white fs-5 mb-4">
          Discover the best Foods and Drinks in Town!
        </p>
        <RestaurantSearch />

        {/* Top Right Buttons */}
        <div className="position-absolute top-0 end-0 p-3 d-flex align-items-center gap-2">
          {/* Admin Button with Icon */}
          {user?.userEmail === "Adminfoodie@gmail.com" && (
            <button
              className="btn btn-dark d-flex align-items-center"
              style={{
                padding: "8px 16px",
                gap: "8px",
                border: "1px solid grey",
              }}
              onClick={() => navigate("/admin-orders")}
            >
              <FaUserShield size={20} />
            </button>
          )}
          {/* Add Restaurant Button */}
          <button
            className="btn btn-dark"
            style={{ border: "1px solid grey" }}
            onClick={() => navigate("/add-restaurant")}
          >
            Add Restaurant
          </button>

          {/* Show Login/Signup button only if user is NOT logged in */}
          {!user ? (
            <button className="btn btn-light" onClick={toggleModal}>
              Log in / Sign up
            </button>
          ) : (
            // Dropdown for Logged-in User
            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
              <DropdownToggle
                caret
                className="btn btn-dark"
                style={{ border: "1px solid grey" }}
              >
                Welcome, {user.userEmail}
              </DropdownToggle>
              <DropdownMenu end style={{ marginTop: "15%", marginLeft: "45%" }}>
                <DropdownItem onClick={handleMyFavorites}>
                  My Favorites
                </DropdownItem>
                <DropdownItem onClick={handleMyOrders}>My Orders</DropdownItem>
                <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </div>

      {showModal && (
  <div
    className="modal fade show"
    style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
    tabIndex="-1"
  >
    <div className="modal-dialog">
      <div className="modal-content" style={{ width: "150%", marginLeft: "-25%" }}>
        <div className="modal-header">
          <h5 className="modal-title">
            {isLoginMode ? "Log In" : "Sign Up"}
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={toggleModal}
          ></button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="container">
            <div className="row">
              {!isLoginMode && (
                <>
                  <div className="col-md-6 mb-3 position-relative">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.fullName ? 'input-error' : ''}`}
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                    {errors.fullName && (
                      <small className="validation-message">{errors.fullName}</small>
                    )}
                  </div>

                  <div className="col-md-6 mb-3 position-relative">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className={`form-control ${errors.address ? 'input-error' : ''}`}
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                    {errors.address && (
                      <small className="validation-message">{errors.address}</small>
                    )}
                  </div>

                  <div className="col-md-6 mb-3 position-relative">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className={`form-control ${errors.phoneNumber ? 'input-error' : ''}`}
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                    />
                    {errors.phoneNumber && (
                      <small className="validation-message">{errors.phoneNumber}</small>
                    )}
                  </div>
                </>
              )}

              <div className="col-md-6 mb-3 position-relative">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${errors.userEmail ? 'input-error' : ''}`}
                  name="userEmail"
                  value={formData.userEmail}
                  onChange={handleChange}
                  required
                />
                {errors.userEmail && (
                  <small className="validation-message">{errors.userEmail}</small>
                )}
              </div>

              {/* Password field with eye icon */}
              <div className="col-md-6 mb-3">
                      <label className="form-label">Password</label>
                      <div className="input-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          name="userPassword"
                          value={formData.userPassword}
                          onChange={handleChange}
                          required
                        />
                        <span
                          className="input-group-text"
                          onClick={togglePasswordVisibility}
                          style={{ cursor: "pointer" }}
                        >
                          {showPassword ? <BsEyeSlash /> : <BsEye />}
                        </span>
                      </div>
                      {errors.userPassword && (
                        <small className="text-danger" style={{ fontWeight: "bold" , color: "#dc3545", top: "173px", position: "absolute"}}>
                          {errors.userPassword}
                        </small>
                      )}
                    </div>

                    {!isLoginMode && (
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Confirm Password</label>
                        <div className="input-group">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="form-control"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                          />
                          <span
                            className="input-group-text"
                            onClick={toggleConfirmPasswordVisibility}
                            style={{ cursor: "pointer" }}
                          >
                            {showConfirmPassword ? <BsEyeSlash /> : <BsEye />}
                          </span>
                        </div>
                        {errors.confirmPassword && (
                          <small className="text-danger" style={{ fontWeight: "bold" , color: "#dc3545", top: "173px", position: "absolute"}}>
                            {errors.confirmPassword}
                          </small>
                        )}
                      </div>
                    )}

                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? "Processing..."
                          : isLoginMode
                          ? "Log In"
                          : "Sign Up"}
                      </button>
                    </div>
                  </div>
                </form>
                <p className="mt-3 text-center">
                  {isLoginMode
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <span
                    className="text-primary"
                    onClick={toggleForm}
                    style={{ cursor: "pointer" }}
                  >
                    {isLoginMode ? "Sign Up" : "Log In"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
