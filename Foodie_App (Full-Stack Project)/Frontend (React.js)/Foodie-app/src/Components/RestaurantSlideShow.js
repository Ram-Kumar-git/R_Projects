import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For navigation
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const RestaurantSlideshow = () => {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8084/api/restaurants")
      .then((response) => {
        console.log("Fetched restaurants:", response.data);
        setRestaurants(response.data.slice(0, 20)); // Limit to 20 restaurants
      })
      .catch((error) => {
        console.error("Error fetching restaurants:", error);
      });
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    appendDots: (dots) => (
      <div className="flex justify-center mt-4">
        <ul className="flex space-x-2">{dots}</ul>
      </div>
    ),
  };

  const handleImageClick = (restaurantName) => {
    navigate(
      `/search?query=${encodeURIComponent(
        restaurantName.replace(/\|/g, "%7C")
      )}`
    );
  };

  return (
    <div
      className="max-w-lg mx-auto my-8 flex flex-col items-center"
      style={{ height: "400px", marginTop: "5%" }}
    >
      <Slider {...settings} className="w-full flex justify-center">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="flex flex-col items-center">
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="object-cover rounded-lg shadow-lg cursor-pointer mx-auto"
              style={{ height: "350px", width: "40%", cursor: "pointer" }}
              onClick={() => handleImageClick(restaurant.name)}
            />
            <p className="text-center mt-2 text-lg font-semibold">
              {restaurant.name}
            </p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default RestaurantSlideshow;
