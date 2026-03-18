import React from 'react';

const STAR = { filled: '★', empty: '☆' };

function StarRating({ average = 0, count = 0, userRating = 0, onRate, readOnly = false }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="star-rating" style={{display: 'inline-flex', alignItems: 'center', gap: '0.2rem'}}>
      <span style={{display: 'inline-flex', gap: '2px'}}>
        {stars.map(s => (
          <span
            key={s}
            title={readOnly ? undefined : `Rate ${s}`}
            onClick={readOnly ? undefined : () => onRate && onRate(s)}
            style={{
              fontSize: readOnly ? '0.95rem' : '1.3rem',
              cursor: readOnly ? 'default' : 'pointer',
              color: s <= Math.round(average) ? '#f59e0b' : '#d1d5db',
              transition: 'color 0.15s',
              lineHeight: 1,
              userSelect: 'none',
            }}
            onMouseEnter={readOnly ? undefined : (e) => {
              const siblings = e.currentTarget.parentElement.children;
              for (let i = 0; i < siblings.length; i++) {
                siblings[i].style.color = i < s ? '#f59e0b' : '#d1d5db';
              }
            }}
            onMouseLeave={readOnly ? undefined : (e) => {
              const siblings = e.currentTarget.parentElement.children;
              for (let i = 0; i < siblings.length; i++) {
                siblings[i].style.color = i < Math.round(average) ? '#f59e0b' : '#d1d5db';
              }
            }}
          >
            {STAR.filled}
          </span>
        ))}
      </span>
      {!readOnly && userRating > 0 && (
        <span style={{fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '4px'}}>
          Your rating: {userRating}
        </span>
      )}
      {count > 0 && (
        <span style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '4px'}}>
          {average.toFixed(1)} ({count})
        </span>
      )}
    </div>
  );
}

export default StarRating;
