import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreatePost from './CreatePost';
import CommentList from './CommentList';
import './PostList.css';

function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5002/posts")
      .then(res => {
        const data = res.data;
        // Query teenus annab objekti, teisendame selle massiiviks
        setPosts(Object.values(data));
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Posts</h1>
      <CreatePost onPostCreated={p => setPosts(prev => [...prev, p])} />

      {posts.map(post => (
        <div key={post.id} className="post">
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <CommentList postId={post.id} comments={post.comments || []} />
        </div>
      ))}
    </div>
  );
}

export default PostList;
