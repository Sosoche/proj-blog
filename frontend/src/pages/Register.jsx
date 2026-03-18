import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../services/api';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        navigate('/login');
      } else {
        setErrorMsg(data.message || 'Registration failed. Username may already exist.');
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
        <h3 className="text-center">Create account ✨</h3>
        {errorMsg && <div className="error-alert">{errorMsg}</div>}
        <form onSubmit={handleRegister}>
          <div className="form-field">
            <label>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required autoFocus />
          </div>
          <div className="form-field">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-field">
            <label>Password <span style={{textTransform:'none', fontWeight:400}}>(min. 6 chars)</span></label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          </div>
          <button type="submit" className="btn-primary-full" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
        <p className="text-center mt-3 mb-0" style={{fontSize: '0.88rem', color: 'var(--text-muted)'}}>
          Already have an account? <Link to="/login" style={{color: 'var(--primary)', fontWeight: 600}}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
