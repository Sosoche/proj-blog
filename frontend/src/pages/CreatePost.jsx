import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../services/api';

function CreatePost({ token }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title, content })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        navigate('/');
      } else {
        setErrorMsg(data.message || 'Failed to publish. Session may have expired.');
      }
    } catch {
      setErrorMsg('Network error while publishing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{maxWidth: '760px'}}>
      <Link to="/" className="back-link">← Cancel</Link>
      <div className="form-card">
        <h2>New Post ✍️</h2>
        {errorMsg && <div className="error-alert">{errorMsg}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Title</label>
            <input type="text" placeholder="An interesting headline…" value={title} onChange={e => setTitle(e.target.value)} required autoFocus />
          </div>
          <div className="form-field">
            <label>Content</label>
            <textarea
              placeholder="Share your thoughts…"
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              style={{minHeight: '260px', resize: 'vertical'}}
            />
          </div>
          <button type="submit" className="btn-primary-full" disabled={loading}>
            {loading ? 'Publishing…' : '🚀 Publish Post'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
