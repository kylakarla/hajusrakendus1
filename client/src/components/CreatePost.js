import React, { useState } from 'react';
import axios from 'axios';

function CreatePost({ onPostCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/posts/create', { title, content });
      setTitle('');
      setContent('');
      onPostCreated(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Error creating post');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} />
      <button type="submit">Add Post</button>
    </form>
  );
}

export default CreatePost;
