import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddRestaurants = () => {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundImage =
      "url('https://th.bing.com/th/id/OIG1.UunApMX7JmqWl32CiErC?w=1792&h=1024&rs=1&pid=ImgDetMain')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.height = "100vh";
    document.body.style.opacity = "0.9";

    return () => {
      document.body.style = "";
    };
  }, []);

  const [restaurant, setRestaurant] = useState({
    name: "",
    address: "",
    imageUrl: "",
    cuisine: "",
  });

  const [approvalStatus, setApprovalStatus] = useState([]); // ✅ Default to an empty array
  // ✅ Initialize as an empty array
  // ✅ Store approval status
  const [snackbar, setSnackbar] = useState({ message: "", type: "" });

  const fetchApprovalStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setSnackbar({ message: "You must be logged in.", type: "danger" });
        return;
      }
  
      const response = await axios.get("http://localhost:8084/api/restaurants/status", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("API Response:", response.data); // 🔍 Debugging log
  
      // ✅ Ensure response is always an array before setting state
      if (Array.isArray(response.data)) {
        setApprovalStatus(response.data);
      } else {
        console.warn("Unexpected API response format:", response.data);
        setApprovalStatus([]); // 🚨 Prevent UI from breaking
      }
    } catch (error) {
      console.error("Error fetching approval status:", error);
      setSnackbar({ message: "Failed to fetch approval status.", type: "danger" });
  
      // ✅ Handle unauthorized case
      if (error.response && error.response.status === 401) {
        setApprovalStatus([]); // 🚨 Prevent UI issues
      }
    }
  };
  
  
  

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      const isValid = /^[A-Za-z\s]{3,}$/.test(value);
      if (!isValid && value !== "") {
        setErrors((prev) => ({
          ...prev,
          name: "Invalid name: Minimum 3 letters, no numbers or special characters.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, name: "" }));
      }
    }
    if (name === "address") {
      if (value.length < 10) {
        setErrors((prev) => ({
          ...prev,
          address: "Address must be at least 10 characters long.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, address: "" }));
      }
    }

    setRestaurant((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSnackbar({ message: "", type: "" });
  
    const token = localStorage.getItem("token");
  
    if (!token) {
      setSnackbar({
        message: "You must be logged in to add a restaurant.",
        type: "danger",
      });
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:8084/api/restaurants/add",
        restaurant, // ❌ No need to add email explicitly
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      setSnackbar({
        message: "Your request has been received. Our team will contact you via phone/email regarding verification of documents. After successful verification, your request will be granted & restaurant will be added to the list.",
        type: "success",
      });
      setRestaurant({ name: "", address: "", imageUrl: "", cuisine: "" });
  
      setTimeout(() => setSnackbar({ message: "", type: "" }), 9000);
    } catch (error) {
      console.error("Error adding restaurant:", error);
      setSnackbar({
        message: "Failed to submit restaurant request.",
        type: "danger",
      });
    }
  
    setTimeout(() => navigate("/"), 9000);
  };
  

  return (
    <div className="d-flex justify-content-center mt-5">
      <button
        onClick={() => (window.location.href = "/")}
        style={{
          padding: "0 0 37px 0",
          background: "transparent",
          color: "red",
          fontSize: "35px",
          border: "none",
          cursor: "pointer",
          position: "absolute",
          top: "2px",
          right: "20px",
        }}
      >
        🏠
      </button>
      <div
        className="card p-4 shadow-lg"
        style={{ width: "50%", backgroundColor: "white" }}
      >
        <h2 className="text-center mb-4 text-primary">🍽️ Add Restaurant</h2>

        {snackbar.message && (
          <div
            className={`alert alert-${snackbar.type} position-fixed top-0 start-50 translate-middle-x mt-3 shadow`}
            style={{ zIndex: 1050, maxWidth: "400px" }}
          >
            {snackbar.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Restaurant Name */}
          <div className="mb-3">
            <label className="form-label fw-bold">Restaurant Name</label>
            <p
              className="text-muted"
              style={{ fontSize: "0.9rem", fontStyle: "italic" }}
            >
              Enter a restaurant name that matches your cuisine, like{" "}
              <strong>"Domino's Pizza"</strong> for Italian.
            </p>
            <input
              type="text"
              className="form-control"
              name="name"
              value={restaurant.name}
              onChange={handleChange}
              required
              style={{ border: "1px solid grey" }}
            />
            {errors.name && (
              <p className="text-danger" style={{ fontSize: "0.85rem" }}>
                {errors.name}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="mb-3">
            <label className="form-label fw-bold">Address</label>
            <p
              className="text-muted"
              style={{ fontSize: "0.9rem", fontStyle: "italic" }}
            >
              Enter a valid and whole restaurant address. 
            </p>
            <input
              type="text"
              className="form-control"
              name="address"
              value={restaurant.address}
              onChange={handleChange}
              required
              style={{ border: "1px solid grey" }}
            />
            {errors.address && (
              <p className="text-danger" style={{ fontSize: "0.85rem" }}>
                {errors.address}
              </p>
            )}
          </div>

          {/* Image URL */}
          <div className="mb-3">
            <label className="form-label fw-bold">Image URL</label>
            <p
              className="text-muted"
              style={{ fontSize: "0.9rem", fontStyle: "italic" }}
            >
              Upload your image to{" "}
              <a
                href="https://imagekit.io/tools/image-to-url/"
                target="_blank"
                rel="noopener noreferrer"
              >
                ImageKit.io
              </a>
              , copy the "Direct CDN URL Link," and paste it here.
            </p>
            <input
              type="text"
              className="form-control"
              name="imageUrl"
              value={restaurant.imageUrl}
              onChange={handleChange}
              required
              style={{ border: "1px solid grey" }}
            />
          </div>

          {/* Cuisine */}
          <div className="mb-3">
            <label className="form-label fw-bold">Cuisine</label>
            <p
              className="text-muted"
              style={{ fontSize: "0.9rem", fontStyle: "italic" }}
            >
              (Italian, Chinese, Mexican, etc.)
            </p>
            <input
              type="text"
              className="form-control"
              name="cuisine"
              value={restaurant.cuisine}
              onChange={handleChange}
              required
              style={{ border: "1px solid grey" }}
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button type="submit" className="btn btn-primary px-4 py-2">
              Submit Request
            </button>
          </div>
        </form>
         {/* ✅ "Check Approval Status" Button */}
<div className="text-center mt-4">
  <button className="btn btn-info px-4 py-2" onClick={fetchApprovalStatus}>
    Check Approval Status
  </button>
</div>

{/* ✅ Show Approval Status for Multiple Restaurants */}
{Array.isArray(approvalStatus) && approvalStatus.length > 0 ? (
  <div className="text-center mt-3">
    <h5 className="fw-bold">Approval Status:</h5>
    <ul className="list-group">
      {approvalStatus.map((request, index) => (
        <li key={request.id || index} 
            className={`list-group-item fw-bold 
            ${request.status === "APPROVED" ? "text-success" : 
              request.status === "REJECTED" ? "text-danger" : "text-warning"}`}>
          <strong>{request.name || "Unknown Restaurant"}</strong> - {request.status || "UNKNOWN"}
        </li>
      ))}
    </ul>
  </div>
) : (
  <p className="text-center text-muted mt-3">No approval requests found.</p>
)}


      </div>
    </div>
  );
};

export default AddRestaurants;
