import React from "react";
import { Grid, Typography, Card, CardMedia, CardContent } from "@mui/material";
import styled from "styled-components"; // Import styled-components
import { useNavigate } from "react-router-dom";

const HeroContainer = styled.div`
  position: relative;
`;

const LandView = ({ products, onAddToCart }) => {
  const navigate = useNavigate();

  const handleButtonClick = (action, item) => {
    if (action === "addToCart") {
      onAddToCart(item); // Trigger add to cart action
    } else if (action === "buyNow") {
      navigate("/ProductDetails", { state: { product: item } });
    }
  };

  return (
    <section id="images-section" className="hero">
      <div
        className="hero-content"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <div style={{ textAlign: "left" }}>
          <Typography
            style={{
              fontFamily: "Protest Revolution",
              color: "#bd682f",
              fontWeight: "500",
              fontSize: "6em",
              marginLeft: "10vw",
            }}
          >
            Dairy Farm
          </Typography>
          <Typography
            style={{
              fontFamily: "Protest Revolution, cursive",
              fontSize: "2em",
              color: "#6F9A3E",
              marginBottom: "8vh", // Add margin to separate the main heading from the subheading
              marginLeft: "12vw",
            }}
          >
            Nature’s Goodness in Every Drop.
          </Typography>
        </div>
        <img
          src="../dairies/hero-sec-img.jpeg"
          style={{
            height: "auto",
            width: "38vw",
            marginLeft: "20px", // Add margin to separate the image from the text
          }}
          alt="Dairy Farm"
        />
      </div>
      <HeroContainer id="images-section" className="hero-container">
        <Grid container spacing={8} sx={{ padding: "30px" }}>
          {products.map((item) => (
            <Grid item xs={6} sm={6} md={3} key={item.id}>
              <Card
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  backgroundColor: "#A3CEF1",
                  boxShadow: " 2px 2px 9px 1px grey",
                }}
              >
                <CardMedia
                  component="img"
                  image={item.image}
                  alt={item.productName}
                  sx={{ height: 200, objectFit: "fill", width: "100%" }}
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    {item.productName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    ₹{item.price}
                  </Typography>
                  <button
                    style={{
                      backgroundColor: "#274C77",
                      color: "white",
                      border: "none",
                      borderRadius: "15px",
                      padding: "10px",
                      cursor: "pointer",
                      float: "left",
                      transition: "transform 0.2s ease",
                    }}
                    onClick={() => handleButtonClick("addToCart", item)} // Add to cart
                    onMouseDown={(e) =>
                      (e.target.style.transform = "scale(1.05)")
                    } // Scale down on click
                    onMouseUp={(e) => (e.target.style.transform = "scale(1)")} // Scale back up on release
                  >
                    Add to Cart
                  </button>
                  <button
                    style={{
                      backgroundColor: "#274C77",
                      color: "white",
                      border: "none",
                      borderRadius: "15px",
                      padding: "10px",
                      cursor: "pointer",
                      float: "right",
                      transition: "transform 0.2s ease",
                    }}
                    onClick={() => handleButtonClick("buyNow", item)} // Buy Now
                    onMouseDown={(e) =>
                      (e.target.style.transform = "scale(1.06)")
                    } // Scale down on click
                    onMouseUp={(e) => (e.target.style.transform = "scale(1)")} // Scale back up on release
                  >
                    Buy Now
                  </button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </HeroContainer>
      <hr />
    </section>
  );
};

export default LandView;