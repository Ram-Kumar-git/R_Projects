import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OrderOnline = () => {
  const navigate = useNavigate();

  const foodCategories = [
    {
      name: "Pizza",
      image:
        "https://img.freepik.com/free-photo/top-view-pepperoni-pizza-with-mushroom-sausages-bell-pepper-olive-corn-black-wooden_141793-2158.jpg?semt=ais_hybrid",
    },
    {
      name: "Burger",
      image:
        "https://static.vecteezy.com/system/resources/thumbnails/023/809/530/small/a-flying-burger-with-all-the-layers-ai-generative-free-photo.jpg",
    },
    {
      name: "Ice Cream",
      image:
        "https://thumbs.dreamstime.com/b/various-varieties-ice-cream-cones-various-varieties-ice-cream-cones-mint-blueberry-strawberry-pistachio-cherry-158155767.jpg",
    },
    {
      name: "sushi",
      image:
        "https://plus.unsplash.com/premium_photo-1668146927669-f2edf6e86f6f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3VzaGl8ZW58MHx8MHx8fDA%3D",
    },
    {
      name: "Pasta",
      image:
        "https://img.freepik.com/free-photo/penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table_2829-19744.jpg",
    },
    {
      name: "sandwich",
      image:
        "https://media.istockphoto.com/id/510482834/photo/sandwich-bread-tomato-lettuce-and-yellow-cheese.jpg?s=612x612&w=0&k=20&c=Q69t_vK73KXddedlvN4RmFcPL34mCwEqprJvbDTyOWo=",
    },
    {
      name: "tacos",
      image:
        "https://media.istockphoto.com/id/1333647378/photo/homemade-american-soft-shell-beef-tacos.jpg?s=612x612&w=0&k=20&c=ZHhpFNbH_BO4MaXzmcKLjC4cPRptdXlp6IVUfs1sBEs=",
    },
    {
      name: "Dosa",
      image:
        "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?cs=srgb&dl=pexels-saveurssecretes-5560763.jpg&fm=jpg",
    },
  ];

  const handleCategoryClick = (category, event) => {
    const target = event.currentTarget; // Capture the target before async execution
    if (!target) return;

    target.style.transform = "scale(0.9)"; // Shrink effect on click

    requestAnimationFrame(() => {
      setTimeout(() => {
        if (target) {
          target.style.transform = "scale(1)"; // Reset after animation
        }
      }, 150);
    });

    navigate(`/search?query=${category}`);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {/* Home Button */}
      <button
        onClick={() => navigate("/")}
        style={{
          padding: "10px",
          background: "transparent",
          color: "red",
          fontSize: "40px",
          border: "none",
          cursor: "pointer",
          marginBottom: "10px",
          position: "absolute",
          right: "20px",
        }}
      >
        🏠
      </button>
      <h2 style={{ color: "#04030f" }}>Order Online!</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          justifyContent: "center",
          maxWidth: "70%",
          margin: "auto",
          marginTop: "20px",
        }}
      >
        {foodCategories.map((category, index) => (
          <div
            key={index}
            onClick={(event) => handleCategoryClick(category.name, event)}
            style={{
              cursor: "pointer",
              transition: "transform 0.3s ease-in-out",
            }}
          >
            <img
              src={category.image}
              alt={category.name}
              style={{
                width: "100%",
                height: "120px",
                borderRadius: "10px",
                objectFit: "cover",
                transition: "transform 0.3s ease-in-out",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              } // Hover effect
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset on mouse leave
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default OrderOnline;