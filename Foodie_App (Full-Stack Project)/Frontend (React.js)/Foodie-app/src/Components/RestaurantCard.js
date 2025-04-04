import React, { useState } from "react";

const RestaurantCard = ({ showSignup }) => {
  const [hovered, setHovered] = useState(null);

  const handleOrderClick = () => {
    window.open("/order-online", "_blank");
  };

  const handleDiningClick = () => {
    window.open("/restaurant-list", "_blank");
  };
  const handlePopularRestaurant = () => {
    window.open("/popular-restaurants", "_blank");
  };

  const styles = {
    container: {
      display: showSignup ? "none" : "flex",
      gap: "20px",
      justifyContent: "center",
      marginTop: "50px", // Increased margin to prevent overlap
      flexWrap: "wrap", // Allows cards to adjust on smaller screens
      position: "relative", // Ensures it does not overlap other elements
      zIndex: 1,
    },
    card: (isHovered) => ({
      width: "350px",
      borderRadius: "10px",
      overflow: "hidden",
      backgroundColor: "white",
      textAlign: "left",
      cursor: "pointer",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      transform: isHovered ? "scale(1.05)" : "scale(1)",
      boxShadow: isHovered
        ? "4px 4px 15px rgba(0, 0, 0, 0.2)"
        : "2px 2px 10px rgba(0, 0, 0, 0.1)",
    }),
    img: {
      width: "100%",
      height: "150px",
      objectFit: "cover",
      borderTopLeftRadius: "10px",
      borderTopRightRadius: "10px",
    },
    body: {
      padding: "10px",
    },
    title: {
      fontSize: "16px",
      fontWeight: "bold",
      margin: "5px 0",
    },
    text: {
      fontSize: "14px",
      color: "gray",
    },
  };

  return (
    <div style={styles.container}>
      <div
        style={styles.card(hovered === 1)}
        onMouseEnter={() => setHovered(1)}
        onMouseLeave={() => setHovered(null)}
        onClick={handleOrderClick}
      >
        <img
          src="https://th.bing.com/th/id/OIG3.t.rv6vEcBM2o3vM2uFyF?pid=ImgGn"
          alt="Order Online"
          style={styles.img}
        />
        <div style={styles.body}>
          <h5 style={styles.title}>Order Online</h5>
          <p style={styles.text}>Stay home and order at your doorstep</p>
        </div>
      </div>

      <div
        style={styles.card(hovered === 2)}
        onMouseEnter={() => setHovered(2)}
        onMouseLeave={() => setHovered(null)}
        onClick={handleDiningClick}
      >
        <img
          src="https://th.bing.com/th/id/OIG1.p_Mb0eow4q.eje_0ueXP?w=1792&h=1024&rs=1&pid=ImgDetMain"
          alt="Dining"
          style={styles.img}
        />
        <div style={styles.body}>
          <h5 style={styles.title}>Dining</h5>
          <p style={styles.text}>View the city's favorite dining venues</p>
        </div>
      </div>
      <div
        style={styles.card(hovered === 3)}
        onMouseEnter={() => setHovered(3)}
        onMouseLeave={() => setHovered(null)}
        onClick={handlePopularRestaurant}
      >
        <img
          src="https://thebeaconauburn.com/wp-content/uploads/2021/08/A-Group-of-People-Eating-Food-at-a-Restaurant.jpeg"
          alt="Order Online"
          style={styles.img}
        />
        <div style={styles.body}>
          <h5 style={styles.title}>Popular Restaurant</h5>
          <p style={styles.text}>Stay home and order at your doorstep</p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
