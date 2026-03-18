import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_URL } from '../services/api';
import StarRating from '../components/StarRating';

function UserProfile() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/users/${username}`)
      .then(res => { if (!res.ok) throw new Error('User not found'); return res.json(); })
      .then(setData)
      .catch(err => setError(err.message));
  }, [username]);

  if (error) return (
    <div className="container py-4" style={{maxWidth:'640px'}}>
      <div className="error-alert">{error}</div>
      <Link to="/" className="back-link">← Back to Posts</Link>
    </div>
  );

  if (!data) return <div className="loading-center"><div className="spinner" /></div>;

  const initial = data.username[0].toUpperCase();

  return (
    <div className="container py-4" style={{maxWidth:'700px'}}>
      <Link to="/" className="back-link">← Back to Posts</Link>

      
      <div className="form-card mb-4" style={{padding:'2rem'}}>
        <div className="d-flex align-items-center gap-4 mb-4 flex-wrap">
          <div style={{
            width:72, height:72, borderRadius:'50%', flexShrink:0,
            background:'linear-gradient(135deg, var(--primary), var(--accent))',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'2rem', color:'#fff', fontWeight:800
          }}>{initial}</div>
          <div>
            <h2 style={{margin:0, fontWeight:800, fontSize:'1.4rem'}}>{data.username}</h2>
            <p style={{margin:'3px 0 0', color:'var(--text-muted)', fontSize:'0.9rem'}}>
              {data.postCount} post{data.postCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        
        <div style={{
          padding:'0.9rem 1.2rem',
          background:'var(--surface-2)',
          borderRadius:'var(--radius-sm)',
          border:'1px solid var(--border)',
          display:'flex', alignItems:'center', gap:'0.75rem'
        }}>
          {data.averageRating > 0 ? (
            <>
              <StarRating average={data.averageRating} count={0} readOnly />
              <span style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>
                avg rating · {data.averageRating.toFixed(1)} / 5
              </span>
            </>
          ) : (
            <span style={{color:'var(--text-muted)', fontSize:'0.9rem'}}>No ratings yet</span>
          )}
        </div>
      </div>

      
      <div className="form-card" style={{padding:'1.75rem'}}>
        <h3 style={{fontWeight:700, marginBottom:'1.25rem', fontSize:'1rem'}}>
          Posts by {data.username}
        </h3>

        {data.posts?.length === 0 ? (
          <p style={{color:'var(--text-muted)', textAlign:'center', padding:'1rem 0'}}>No posts yet.</p>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:'0.6rem'}}>
            {data.posts.map(p => (
              <Link key={p.id} to={`/post/${p.id}`} style={{textDecoration:'none'}}>
                <div
                  style={{
                    padding:'0.9rem 1.2rem',
                    background:'var(--surface-2)',
                    borderRadius:'var(--radius-sm)',
                    border:'1.5px solid var(--border)',
                    display:'flex', justifyContent:'space-between',
                    alignItems:'flex-start', gap:'1rem', color:'var(--text)',
                    transition:'border-color var(--transition)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div>
                    <div style={{fontWeight:600, fontSize:'0.95rem'}}>{p.title}</div>
                    <div style={{fontSize:'0.8rem', color:'var(--text-muted)', marginTop:'3px'}}>
                      {p.content?.substring(0, 75)}…
                    </div>
                  </div>
                  <div style={{
                    fontSize:'0.78rem', color:'var(--text-muted)',
                    whiteSpace:'nowrap', flexShrink:0, paddingTop:'2px'
                  }}>
                    {new Date(p.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
