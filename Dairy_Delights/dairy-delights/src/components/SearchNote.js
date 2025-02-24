import React from 'react';
import { Search } from '@mui/icons-material';

export default function SearchNote({ onSearchNote, searchText }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '300px',position:'relative',top:'-12px' }}>
      <input
        className='search-input'
        style={{
          width: '350px',
          height: '30px', // Adjusted height
          backgroundColor:'#6096BA',
          border: '1px solid white',
          borderRadius: '20px',
          padding: '0 10px',
          fontSize: '14px',
          marginBottom:'-90px'
        }}
        type="text"
        value={searchText}
        placeholder="🔎Search for Product"
        onChange={onSearchNote}
      />
    </div>
  );
}
