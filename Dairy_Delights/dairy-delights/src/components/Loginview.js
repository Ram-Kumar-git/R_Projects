import React, { useState } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginView = () => {
  const navigate = useNavigate();
  const [securityCode, setSecurityCode] = useState('');
  const [error, setError] = useState('');

  // Hardcoded security code for demo
  const validSecurityCode = 'admin123';

  const handleSecurityCodeChange = (e) => {
    setSecurityCode(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Validate the security code
    if (securityCode === validSecurityCode) {
      // Store the login status in localStorage or state
      localStorage.setItem('isAuthenticated', 'true');
      // Redirect to order-requests page
      navigate('/order-requests');
    } else {
      setError('Invalid security code. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm" style={{ padding: '20px',border:'1px solid green',marginTop:'40px',backgroundColor:'#274C77',borderRadius:'10px',marginBottom:'320px'}}>
      <Typography variant="h5" gutterBottom style={{color:'white',fontFamily:'Protest Revolution'}}>
       Enter Security Code 
      </Typography>
      <form onSubmit={handleLogin}>
        <TextField
          label="Enter Security Code"
          variant="filled"
          type='password'
          fullWidth
          value={securityCode}
          onChange={handleSecurityCodeChange}
          style={{ marginBottom: '20px',backgroundColor:'white',color:'#95B8D0' }}
        />
        {error && (
          <Typography color="error" style={{ marginBottom: '20px' }}>
            {error}
          </Typography>
        )}
        <Button type="submit" variant="contained" style={{backgroundColor:'#6096BA'}} >
          Login
        </Button>
      </form>
    </Container>
  );
};

export default LoginView;
