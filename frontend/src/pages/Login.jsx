import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../services/api';

function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        navigate('/');
      } else {
        setErrorMsg(data.message || 'Invalid username or password.');
      }
    } catch {
      setErrorMsg('Network error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{maxWidth: '420px'}}>
      <div className="form-card">
        <h3 className="text-center">Welcome back 👋</h3>
        {errorMsg && <div className="error-alert">{errorMsg}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-field">
            <label>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required autoFocus />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary-full" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
        <p className="text-center mt-3 mb-0" style={{fontSize: '0.88rem', color: 'var(--text-muted)'}}>
          No account? <Link to="/register" style={{color: 'var(--primary)', fontWeight: 600}}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
