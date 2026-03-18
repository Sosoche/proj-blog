import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../services/api';
import StarRating from '../components/StarRating';

function Profile({ token }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/users/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => { if (!res.ok) throw new Error('Failed to load profile'); return res.json(); })
      .then(setData)
      .catch(err => setError(err.message));
  }, [token]);

  if (!token) return (
    <div className="container py-5" style={{maxWidth:'480px'}}>
      <div className="form-card text-center">
        <div style={{fontSize:'3rem', marginBottom:'1rem'}}>🔐</div>
        <h3>You're not logged in</h3>
        <p style={{color:'var(--text-muted)'}}>Please log in to see your profile.</p>
        <Link to="/login" style={{display:'inline-block', marginTop:'0.5rem'}}>
          <button className="btn-primary-full" style={{width:'auto', padding:'0.65rem 2rem'}}>Login</button>
        </Link>
      </div>
    </div>
  );

  if (error) return <div className="container py-4"><div className="error-alert">{error}</div></div>;
  if (!data) return <div className="loading-center"><div className="spinner" /></div>;

  const initial = data.username[0].toUpperCase();

  return (
    <div className="container py-4" style={{maxWidth:'800px'}}>

      
      <div className="form-card mb-4" style={{padding:'2rem'}}>
        <div className="d-flex align-items-center gap-4 mb-4 flex-wrap">
          
          <div style={{
            width:80, height:80, borderRadius:'50%', flexShrink:0,
            background:'linear-gradient(135deg, var(--primary), var(--accent))',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'2.2rem', color:'#fff', fontWeight:800
          }}>{initial}</div>

          
          <div style={{flex:1}}>
            <h2 style={{margin:0, fontWeight:800, fontSize:'1.5rem'}}>{data.username}</h2>
            <p style={{margin:'2px 0 0', color:'var(--text-muted)', fontSize:'0.9rem'}}>{data.email}</p>
          </div>

          
          <Link to="/create" className="btn-write" style={{textDecoration:'none', alignSelf:'center'}}>
            ✏️ Write Post
          </Link>
        </div>

        
        <div style={{
          display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(120px,1fr))', gap:'1rem'
        }}>
          <div className="stat-pill">
            <span className="stat-num">{data.postCount}</span>
            <span className="stat-label">Posts</span>
          </div>
          <div className="stat-pill">
            <span className="stat-num">{data.averageRating > 0 ? data.averageRating.toFixed(1) : '—'}</span>
            <span className="stat-label">Avg Rating</span>
          </div>
          {data.recentComments?.length > 0 && (
            <div className="stat-pill">
              <span className="stat-num">{data.recentComments.length}</span>
              <span className="stat-label">New Replies</span>
            </div>
          )}
        </div>

        
        {data.averageRating > 0 && (
          <div className="mt-3">
            <StarRating average={data.averageRating} count={0} readOnly />
            <span style={{color:'var(--text-muted)', fontSize:'0.82rem', marginLeft:'0.5rem'}}>average across your posts</span>
          </div>
        )}
      </div>

      
      <div className="row g-4">

        
        <div className="col-md-5">
          <div className="comments-panel h-100">
            <div className="comments-panel-header">
              <h3>Replies to your posts</h3>
              {data.recentComments?.length > 0 && (
                <span className="comment-count">{data.recentComments.length}</span>
              )}
            </div>

            {data.recentComments?.length === 0 ? (
              <div className="comments-empty" style={{padding:'1.5rem'}}>
                No replies yet — share your posts to get feedback!
              </div>
            ) : (
              <div style={{maxHeight:'400px', overflowY:'auto'}}>
                {data.recentComments.map(c => (
                  <div key={c.id} className="comment-item">
                    
                    <div style={{marginBottom:'4px'}}>
                      <Link to={`/user/${c.author?.username}`} style={{textDecoration:'none'}}>
                        <span className="comment-author">{c.author?.username ?? 'Anonymous'}</span>
                      </Link>
                      <span className="comment-date">
                        {' · '}{new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    
                    <p className="comment-text mb-1">{c.content}</p>

                    
                    <Link
                      to={`/post/${c.post?.id}`}
                      style={{fontSize:'0.78rem', color:'var(--text-muted)', textDecoration:'none', fontStyle:'italic'}}>
                      on "{c.post?.title ?? 'your post'}" →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        
        <div className="col-md-7">
          <div className="form-card h-100" style={{padding:'1.5rem'}}>
            <h3 style={{fontWeight:700, marginBottom:'1.25rem', fontSize:'1rem'}}>My Posts</h3>

            {data.posts?.length === 0 ? (
              <div style={{color:'var(--text-muted)', textAlign:'center', padding:'2rem 0'}}>
                <div style={{fontSize:'2.5rem', marginBottom:'0.75rem'}}>📝</div>
                <p style={{margin:0}}>You haven't written anything yet.</p>
                <Link to="/create" style={{color:'var(--primary)', fontWeight:600, fontSize:'0.9rem'}}>
                  Write your first post →
                </Link>
              </div>
            ) : (
              <div style={{display:'flex', flexDirection:'column', gap:'0.6rem', maxHeight:'400px', overflowY:'auto'}}>
                {data.posts.map(p => (
                  <Link key={p.id} to={`/post/${p.id}`} style={{textDecoration:'none'}}>
                    <div
                      style={{
                        padding:'0.8rem 1rem',
                        background:'var(--surface-2)',
                        borderRadius:'var(--radius-sm)',
                        border:'1.5px solid var(--border)',
                        color:'var(--text)',
                        transition:'border-color var(--transition)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                      <div style={{fontWeight:600, fontSize:'0.93rem', marginBottom:'2px'}}>{p.title}</div>
                      <div style={{fontSize:'0.78rem', color:'var(--text-muted)'}}>
                        {new Date(p.createdAt).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
