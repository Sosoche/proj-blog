import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ token, setToken }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
    <nav className="blog-navbar">
      <div className="container d-flex align-items-center">
        <Link className="navbar-brand" to="/">✦ BlogApp</Link>
        <div className="d-flex align-items-center gap-2 ms-auto">
          {token ? (
            <>
              <Link className="nav-link" to="/profile" style={{fontWeight: 500, fontSize: '0.9rem'}}>👤 Profile</Link>
              <button
                className="nav-link btn btn-link text-decoration-none"
                style={{color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.9rem', padding: '0.4rem 0.8rem'}}
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">Login</Link>
              <Link className="btn-write" to="/register">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
