import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const navStyle = {
  display: 'flex',
  justifyContent: 'center',
  padding: '20px',
  background: '#f0f0f0',
};

const linkStyle = {
  margin: '0 10px',
  textDecoration: 'none',
  color: '#333',
  padding: '5px 10px',
  borderRadius: '5px',
  transition: 'all 0.3s ease',
};

const hoverStyle = {
  background: '#007bff',
  color: '#fff',
};

const Nav = React.memo(function Nav() {
  const [hoverIndex, setHoverIndex] = useState(null);

  return (
    <nav style={navStyle}>
      {['/', '/about', '/checkout'].map((path, index) => (
        <Link
          key={path}
          to={`${path}#qeen-dev`}
          style={hoverIndex === index ? { ...linkStyle, ...hoverStyle } : linkStyle}
          onMouseEnter={() => setHoverIndex(index)}
          onMouseLeave={() => setHoverIndex(null)}
          className="nav"
        >
          {path === '/' ? 'Home' : path.substring(1).charAt(0).toUpperCase() + path.substring(2)}
        </Link>
      ))}
    </nav>
  );
});

export default Nav;