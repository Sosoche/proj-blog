import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../services/api';
import StarRating from '../components/StarRating';

function Home() {
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/posts?page=${page}&size=6&search=${search}`)
      .then(res => res.json())
      .then(data => {
        const items = data.content || data;
        setPosts(items);
        if (data.totalPages !== undefined) setTotalPages(data.totalPages);
        Promise.all(items.map(p =>
          fetch(`${API_URL}/ratings/post/${p.id}`)
            .then(r => r.json())
            .then(r => ({ id: p.id, ...r }))
        )).then(res => {
          const map = {};
          res.forEach(r => { map[r.id] = r; });
          setRatings(map);
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, search]);

  return (
    <div className="container py-4" style={{ maxWidth: '1100px' }}>
      <div className="d-flex gap-3 mb-4 align-items-center justify-content-center">
        <div className="search-wrap" style={{ flex: 1, margin: 0 }}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search posts…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
          />
        </div>
        <Link to="/create" className="btn-write" style={{ whiteSpace: 'nowrap', textDecoration: 'none' }}>
          ✏️ Write Post
        </Link>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📭</div>
          <p>No posts found{search ? ` for "${search}"` : ''}.</p>
        </div>
      ) : (
        <div className="row g-4">
          {posts.map(post => {
            const r = ratings[post.id];
            return (
              <div className="col-md-4" key={post.id}>
                <div className="post-card">
                  <h5>{post.title}</h5>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="post-meta" style={{ margin: 0 }}>
                      <Link to={`/user/${post.author?.username}`} style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                        {post.author?.username ?? 'Unknown'}
                      </Link>
                      &nbsp;·&nbsp;
                      {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  {r && r.count > 0 && (
                    <div className="mb-2">
                      <StarRating average={r.average} count={r.count} readOnly />
                    </div>
                  )}
                  <p className="excerpt">{post.content.substring(0, 120)}…</p>
                  <Link to={`/post/${post.id}`} className="btn-read">Read More →</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination-wrap">
          <button className="btn-page" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span className="page-info">{page + 1} / {totalPages}</span>
          <button className="btn-page" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}

export default Home;
