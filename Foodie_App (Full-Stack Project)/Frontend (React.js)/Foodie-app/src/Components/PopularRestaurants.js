import React from "react";
import { useNavigate } from "react-router-dom";

const popularRestaurants = [
  {
    name: "KFC",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOdT1n1jZh8iV5Wlg3ChqKAX68_bD1ogM3EQ&s",
  },
  {
    name: "Domino's",
    image:
      "https://play-lh.googleusercontent.com/_lq2HX0YJNDrr0EeUebLAB2JsGbRGyoFY-XOnuUFTPfeEqaHNIyMOGqLx-oq4mUWPpn0",
  },
  {
    name: "McDonald's",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-IzxwSu2wMgYK7gydcSEDYlOqouerLYPIrw&s",
  },
  {
    name: "Pizza Hut",
    image:
      "https://upload.wikimedia.org/wikipedia/sco/thumb/d/d2/Pizza_Hut_logo.svg/2177px-Pizza_Hut_logo.svg.png",
  },
  {
    name: "Subway",
    image:
      "https://admin.itsnicethat.com/images/jVqk83W-W8qGG18o6e0frMP4aTU=/27734/width-1440/57a8ace67fa44c98d1002105.jpg",
  },
  {
    name: "Burger King",
    image:
      "https://images.seeklogo.com/logo-png/2/1/burger-king-logo-png_seeklogo-23687.png",
  },
  {
    name: "Taco Bell",
    image: "https://www.hatchwise.com/wp-content/uploads/2023/01/image-26.png",
  },
  {
    name: "Starbucks",
    image:
      "https://th.bing.com/th/id/R.05c0ef44bd2599190e56b9e55073805b?rik=ELtcZru6jfgSxA&riu=http%3a%2f%2fclipart-library.com%2fimages_k%2ftransparent-starbucks-logo%2ftransparent-starbucks-logo-24.png&ehk=ct1259%2fwL6A%2bVhy1vFwN8ueMc2hs7UKcEFB2FCU4DMc%3d&risl=&pid=ImgRaw&r=0",
  },
];
const PopularRestaurants = () => {
  const navigate = useNavigate();

  const handleClick = (restaurantName) => {
    navigate(`/search?query=${restaurantName}`);
  };

  return (
    <div
      style={{
        padding: "20px",
        textAlign: "center",
        backgroundColor: "#f8f8f8",
      }}
    >
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
      <h2 style={{ color: "#04030f" }}>Popular Restaurants</h2>

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
        {popularRestaurants.map((restaurant, index) => (
          <div
            key={index}
            onClick={() => handleClick(restaurant.name)}
            style={{
              cursor: "pointer",
              transition: "transform 0.3s ease-in-out",
            }}
          >
            <img
              src={restaurant.image}
              alt={restaurant.name}
              style={{
                width: "100%",
                height: "120px",
                borderRadius: "50px",
                objectFit: "contain",
                transition: "transform 0.3s ease-in-out",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              } // Hover effect
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset on mouse leave
            />
            <h3
              style={{ marginTop: "8px", fontSize: "16px", fontWeight: "bold" }}
            >
              {/* {restaurant.name} */}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};
export default PopularRestaurants;