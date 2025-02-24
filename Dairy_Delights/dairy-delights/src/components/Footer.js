import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <div className="footer" style={{ backgroundColor: "#274C77", color: "white" }}>
      <div className="social-icons" data-testid="iconsr">
        <a href="https://facebook.com">
          {/* <i className="fab fa-facebook-f"></i> */}
          <FaFacebook />
        </a>
        <a href="https://instagram.com">
          <FaInstagram />
        </a>
        <a href="https://linkedin.com">
          <FaLinkedin />
        </a>
        <p data-testid="logos">
          <span style={{fontFamily:"Twinkle Star",fontWeight:'500'}}>&copy; 2024 Dairy Delights</span> <br />
          All rights reserved.
        </p>
      </div>

      <div className="icons2">
        <ul>
          <li>
            <b>Know Us</b>
          </li>
          <li>Contact Us</li>
          <li>About Us</li>
        </ul>
      </div>

      <div className="icons3">
        <ul>
          <li>
            <b>Need Help</b>
          </li>
          <li>FAQ</li>
          <li>terms & Conditions</li>
        </ul>
      </div>
    </div>
  );
}