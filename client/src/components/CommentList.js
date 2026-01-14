import React, { useState } from 'react';
import axios from 'axios';

function CommentList({ postId, comments = [] }) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await axios.post(`http://localhost:5001/comments/${postId}`, { content });
      setContent('');
      // pole vaja refetchi — Query teenus saab sündmuse event-busi kaudu
    } catch (err) {
      alert(err.response?.data?.error || 'Error creating comment');
    }
  };

  return (
    <div className="comments">
      <h4>Comments</h4>
      <ul>
        {comments.length === 0 && <li>No comments yet</li>}
        {comments.map((c) => (
          <li key={c.id}>{c.content}</li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Add Comment</button>
      </form>
    </div>
  );
}

export default CommentList;
