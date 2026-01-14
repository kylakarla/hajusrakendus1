const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

let comments = [];
let lastId = 0;

app.get('/comments/:postId', (req, res) => {
  const postId = Number(req.params.postId);
  res.json(comments.filter((c) => c.postId === postId));
});

app.post('/comments/:postId', async (req, res) => {
  const postId = Number(req.params.postId);
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Content is required' });

  const newComment = { id: ++lastId, postId, content };
  comments.push(newComment);

  await axios.post('http://localhost:5005/events', {
    type: 'CommentCreated',
    data: newComment,
  });

  res.status(201).json(newComment);
});

app.post('/events', (req, res) => {
  console.log('Received event:', req.body);
  res.send({});
});

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];

    const comment = comments.find(comment => comment.id === id);
    comment.status = status;

    await axios.post('http://localhost:5005/events', {
      type: 'CommentUpdated',
      data: {
        id,
        status,
        postId,
        content,
      },
    });
  }

  res.send({});
});

app.listen(5001, () => console.log('Comments service running on http://localhost:5001'));
