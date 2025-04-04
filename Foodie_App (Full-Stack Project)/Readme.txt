# 🍽️ Foodie App - Restaurant Discovery & Ordering Platform

Welcome to **Foodie App**, a Swiggy/Zomato-inspired microservices-based platform that helps users discover, favorite, and order from their favorite restaurants. It integrates external APIs, handles authentication, and supports payments with a clean backend architecture.

---

## 🚀 Project Overview

The Foodie App allows users to:

- Search restaurants using Google Places API
- Add and manage favorite restaurants
- Browse menu items and add them to a cart
- Place orders using cart items
- Make payments via Stripe (supporting INR, UPI, and card)
- Register/login with secure JWT-based authentication
- Admins can approve/reject newly added restaurants

---

## 🛠️ Tech Stack

### 📦 Backend Microservices (Java + Spring Boot):
- **User Service**: Handles registration, login, JWT auth
- **Restaurant Service**: Fetches restaurant data from Google Places API & stores metadata in MongoDB
- **Favorite Service**: Manages user's favorite restaurants
- **Order Service**: Validates menu items via Restaurant Service and handles cart functionality
- **Payment Service**: Integrated with Stripe API for INR payments

### 🗃️ Database:
- **MongoDB**: For restaurant metadata and favorites
- **MySQL**: For user info, orders, and payments

### 🔧 Tools & Libraries:
- Spring Boot, Spring Security (JWT)
- Spring Data JPA, Spring Cloud OpenFeign
- Stripe API (for payments)
- Google Places API (for restaurant info)
- MongoDB Compass, Postman
- Maven for project build
- IntelliJ IDEA / VS Code

---

## ⚙️ How to Run the Project

### ✅ Prerequisites
- Java 17+
- Maven
- MySQL & MongoDB running locally
- Stripe API Key (test mode)
- Google Places API Key

---

### 📁 Project Structure

Each microservice is in its own folder:

/user-service
/user-profile(saving user profile in mongoDB)
/restaurant-service
/favorite-service
/order-service
/payment-service



---

### 🔄 Steps to Run

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/foodie-app.git
   cd foodie-app
Configure application.properties
For each service, update:

DB URL, username, and password

API keys (Stripe, Google Places)

JWT secret and expiration

Start MySQL and MongoDB

Run all services one by one

bash

cd user-service
mvn spring-boot:run
Repeat for all other services.

Test APIs with Postman
Use the provided Postman collection to test user login, restaurant search, favorites, cart, and payments.

🔐 Authentication
Uses Spring Security and JWT

After login, users get a JWT token to access protected endpoints

🧪 Testing
Use Postman to test each service

Validate authentication, adding to favorites, order/cart logic, and payment flow

📦 Future Enhancements
Frontend with React or Angular

Email notifications on order placement

Real-time order tracking

Role-based admin panel

🤝 Contributors
Ram Kumar R. – Developer, System Designer

ChatGPT – Tech Consultant 😉

📬 Contact
For any queries or collaborations:
📧 ram8903866@gmail.com
📱 +91 86675 89588
🌐 LinkedIn: RAM KUMAR R.