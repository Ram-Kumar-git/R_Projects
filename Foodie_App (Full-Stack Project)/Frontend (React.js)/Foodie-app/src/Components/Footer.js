import React, { useState } from "react";

const Footer = () => {
  const [showAboutPopup, setShowAboutPopup] = useState(false);
  const [showPrivacyPopup, setShowPrivacyPopup] = useState(false);
  const [showSecurityPopup, setShowSecurityPopup] = useState(false);

  return (
    <>
      <footer style={styles.footer}>
        {/* Social Media Icons */}
        <div style={styles.icons}>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram" style={styles.icon}></i>
          </a>
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook" style={styles.icon}></i>
          </a>
          <a href="https://www.twitter.com/" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter" style={styles.icon}></i>
          </a>
        </div>

        {/* Navigation Links */}
        <div style={styles.navLinks}>
          <p style={styles.link} onClick={() => setShowAboutPopup(true)}>
            About Us
          </p>
          <span style={styles.separator}>|</span>
          <p style={styles.link} onClick={() => setShowPrivacyPopup(true)}>
            Privacy Policy
          </p>
          <span style={styles.separator}>|</span>
          <p style={styles.link} onClick={() => setShowSecurityPopup(true)}>
            Security
          </p>
        </div>

        {/* Copyright Text */}
        <p style={styles.text}>
          © {new Date().getFullYear()} By continuing past this page, you agree to our Terms of Service, Cookie Policy, Privacy Policy, and Content Policies.
          All trademarks are properties of their respective owners. 2020-2025 © Foodie™ Ltd. All rights reserved.
        </p>
      </footer>

      {/* About Us Popup */}
      {showAboutPopup && (
        <div style={styles.popup}>
          <div style={styles.popupContent}>
            <h3>About Us</h3>
            <p>
              Welcome to Foodie! We are passionate about bringing delicious meals right to your doorstep. 
              Our platform connects food lovers with the best local restaurants and home chefs. Enjoy your favorite dishes with ease!
            </p>
            <button onClick={() => setShowAboutPopup(false)} style={styles.closeButton}>Close</button>
          </div>
        </div>
      )}

      {/* Privacy Policy Popup */}
      {showPrivacyPopup && (
        <div style={styles.popup}>
          <div style={styles.popupContent}>
            <h3>Privacy Policy</h3>
            <p>
              Your privacy is important to us. We ensure that your personal data is kept secure and never shared with third parties 
              without your consent. Read our full privacy policy to understand how we protect your data.
            </p>
            <button onClick={() => setShowPrivacyPopup(false)} style={styles.closeButton}>Close</button>
          </div>
        </div>
      )}

      {/* Security Popup */}
      {showSecurityPopup && (
        <div style={styles.popup}>
          <div style={styles.popupContent}>
            <h3>Security</h3>
            <p>
              We use advanced encryption and security measures to protect your data and transactions. 
              Your payment information is processed securely to ensure a safe shopping experience.
            </p>
            <button onClick={() => setShowSecurityPopup(false)} style={styles.closeButton}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

// Styles
const styles = {
  footer: {
    backgroundColor: "#28282b",
    color: "whitesmoke",
    textAlign: "center",
    padding: "15px",
    fontSize: "14px",
    position: "relative",
    marginTop: "2%",
  },
  icons: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "10px",
  },
  icon: {
    fontSize: "20px",
    color: "whitesmoke",
    cursor: "pointer",
  },
  navLinks: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "10px",
  },
  link: {
    color: "gray",
    textDecoration: "underline",
    cursor: "pointer",
  },
  separator: {
    color: "whitesmoke",
  },
  text: {
    fontSize: "12px",
    maxWidth: "90%",
    margin: "10px auto",
  },
  // Popup Styles
  popup: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  popupContent: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "40%",
    textAlign: "center",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
  },
  closeButton: {
    marginTop: "15px",
    padding: "8px 15px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Footer;