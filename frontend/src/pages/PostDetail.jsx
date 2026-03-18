import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_URL } from '../services/api';
import StarRating from '../components/StarRating';

const PAGE_SIZE = 10;

function PostDetail({ token }) {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentPage, setCommentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [commentError, setCommentError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState({ average: 0, count: 0, userRating: 0 });
  const listRef = useRef(null);
  const observerRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetch(`${API_URL}/posts/${id}`)
      .then(res => { if (!res.ok) throw new Error('Post not found'); return res.json(); })
      .then(setPost)
      .catch(err => setErrorMsg(err.message));

    fetchRating();
  }, [id]);

  const fetchRating = () => {
    fetch(`${API_URL}/ratings/post/${id}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    }).then(r => r.json()).then(setRating).catch(console.error);
  };

  const handleRate = async (value) => {
    if (!token) return;
    await fetch(`${API_URL}/ratings/post/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ value })
    }).then(r => r.json()).then(setRating).catch(console.error);
  };

  const fetchComments = useCallback((pageNum) => {
    setLoadingComments(true);
    fetch(`${API_URL}/comments/post/${id}?page=${pageNum}&size=${PAGE_SIZE}`)
      .then(res => res.json())
      .then(data => {
        const newItems = Array.isArray(data) ? data : (data.content ?? []);
        const total = data.totalPages ?? 1;
        setComments(prev => pageNum === 0 ? newItems : [...prev, ...newItems]);
        setHasMore(pageNum < total - 1);
        setCommentPage(pageNum);
      })
      .catch(console.error)
      .finally(() => setLoadingComments(false));
  }, [id]);

  useEffect(() => { fetchComments(0); }, [fetchComments]);

  useEffect(() => {
    if (!bottomRef.current) return;
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingComments) {
        fetchComments(commentPage + 1);
      }
    }, { root: listRef.current, threshold: 0.8 });
    observerRef.current.observe(bottomRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loadingComments, commentPage, fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setCommentError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/comments/post/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ content: newComment.trim() })
      });
      if (res.ok) {
        setNewComment('');
        fetchComments(0);
        if (listRef.current) listRef.current.scrollTop = 0;
      } else {
        const data = await res.json().catch(() => ({}));
        setCommentError(data.message || 'Failed to post comment.');
      }
    } catch { setCommentError('Network error while posting comment.'); }
    finally { setSubmitting(false); }
  };

  if (errorMsg) return (
    <div className="container py-4" style={{maxWidth: '760px'}}>
      <div className="error-alert">{errorMsg}</div>
      <Link to="/" className="back-link">← Back to Posts</Link>
    </div>
  );

  if (!post) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div className="container py-4" style={{maxWidth: '760px'}}>
      <Link to="/" className="back-link">← Back to Posts</Link>

      <div className="post-detail-card">
        <h1>{post.title}</h1>
        <div className="d-flex gap-2 flex-wrap mb-2">
          <Link to={`/user/${post.author?.username}`} className="post-author-badge" style={{textDecoration:'none', color:'var(--primary)'}}>
            ✍️ {post.author?.username ?? 'Unknown'}
          </Link>
          <span className="post-author-badge">
            📅 {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            {' · '}
            {new Date(post.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        
        <div className="d-flex align-items-center gap-2 mt-2 mb-1">
          <StarRating
            average={rating.average}
            count={rating.count}
            userRating={rating.userRating}
            readOnly={!token}
            onRate={handleRate}
          />
          {!token && <span style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>Log in to rate</span>}
        </div>

        <hr style={{borderColor: 'var(--border)', margin: '1.5rem 0'}} />
        <div className="post-body">{post.content}</div>
      </div>

      <div className="comments-panel">
        <div className="comments-panel-header">
          <h3>Comments</h3>
          <span className="comment-count">{comments.length}</span>
        </div>

        <div className="comment-form-area">
          {token ? (
            <form onSubmit={handleSubmit}>
              {commentError && <div className="error-alert mb-2">{commentError}</div>}
              <textarea placeholder="Share your thoughts…" value={newComment} onChange={e => setNewComment(e.target.value)} required />
              <div className="d-flex justify-content-end mt-2">
                <button type="submit" className="btn-submit-comment" disabled={submitting}>
                  {submitting ? 'Posting…' : 'Post Comment'}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-center mb-0" style={{color: 'var(--text-muted)', fontSize: '0.9rem', padding: '0.5rem 0'}}>
              <Link to="/login" style={{color: 'var(--primary)', fontWeight: 600}}>Log in</Link> to leave a comment.
            </p>
          )}
        </div>

        <div className="comments-list" ref={listRef}>
          {comments.length === 0 && !loadingComments ? (
            <div className="comments-empty">No comments yet — be the first! 🙌</div>
          ) : comments.map(c => (
            <div key={c.id} className="comment-item">
              <Link to={`/user/${c.author?.username}`} style={{textDecoration:'none'}}>
                <span className="comment-author">{c.author?.username ?? 'Unknown'}</span>
              </Link>
              <span className="comment-date">{new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <p className="comment-text mb-0">{c.content}</p>
            </div>
          ))}
          <div ref={bottomRef} style={{height: 1}} />
          {loadingComments && (
            <div className="d-flex justify-content-center py-3">
              <div className="spinner" style={{width: 24, height: 24, borderWidth: 2}} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
