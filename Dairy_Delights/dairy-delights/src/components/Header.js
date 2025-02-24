import React, { useState, useEffect } from 'react';
import { Home, ShoppingCart, Phone, ShoppingBag } from '@mui/icons-material';
import { IconButton, Badge } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';

// Create a styled IconButton component
const StyledIconButton = styled(IconButton)({
  color: 'white',
  '&:hover': {
    color: '#6096BA', // Change color on hover
  },
});

const Header = ({ cartItems, onCategoryClick }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleScrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLoginLogout = () => {
    if (isAuthenticated) {
      localStorage.setItem('isAuthenticated', 'false');
      setIsAuthenticated(false);
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="header" style={{backgroundColor:'#274C77'}}>
      <div>
        <figure id="logotext">
          <h1>Dairy delights</h1>
          <h3 id="logot">Celebrate Your Moment</h3>
        </figure>
        <div className="IconContainer" style={{ marginLeft: '1200px', paddingTop: '17px' }}>
          <StyledIconButton aria-label="home" onClick={() => navigate('/')}>
            <Home />
          </StyledIconButton>
          <StyledIconButton aria-label="cart">
            <Badge badgeContent={cartItems.length} onClick={() => navigate('/OrderView')}>
              <ShoppingCart />
            </Badge>
          </StyledIconButton >
          <StyledIconButton aria-label="phone">
            <Phone />
          </StyledIconButton>
          <StyledIconButton aria-label="profile" onClick={handleLoginLogout}>
            <ShoppingBag />
          </StyledIconButton>
        </div>
      </div>
      <nav className="navbar" data-testid="links" style={{backgroundColor:'#6096BA'}}>
        <ul className="nav-links">
          <li>
            <a href="#" onClick={() => { onCategoryClick(""); handleScrollToSection("images-section"); }}>All</a>
          </li>
          <li>
            <a href="#milk" onClick={() => { onCategoryClick("milk"); handleScrollToSection("images-section"); }}>Milk</a>
          </li>
          <li>
            <a href="#butter" onClick={() => { onCategoryClick("butter"); handleScrollToSection("images-section"); }}>Butter</a>
          </li>
          <li>
            <a href="#cheese" onClick={() => { onCategoryClick("cheese"); handleScrollToSection("images-section"); }}>Cheese</a>
          </li>
          <li>
            <a href="#curd" onClick={() => { onCategoryClick("curd"); handleScrollToSection("images-section"); }}>Curd</a>
          </li>
          <li>
            <a href="#cream" onClick={() => { onCategoryClick("cream"); handleScrollToSection("images-section"); }}>Cream</a>
          </li>
          <li>
            <a href="#yogurt" onClick={() => { onCategoryClick("yogurt"); handleScrollToSection("images-section"); }}>Yogurt</a>
          </li>
          <li>
            <a href="#panner" onClick={() => { onCategoryClick("paneer"); handleScrollToSection("images-section"); }}>Paneer</a>
          </li>
          <li>
            <a href="#ghee" onClick={() => { onCategoryClick("ghee"); handleScrollToSection("images-section"); }}>Ghee</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
