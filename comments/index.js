const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

let comments = [];
let lastId = 0;

// GET comments by postId
app.get('/comments/:postId', (req, res) => {
  const postId = Number(req.params.postId);
  res.json(comments.filter(c => c.postId === postId));
});

// POST new comment
app.post('/comments/:postId', async (req, res) => {
  const postId = Number(req.params.postId);
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Content is required' });

  const newComment = {
    id: ++lastId,
    postId,
    content,
    status: 'pending',
  };

  comments.push(newComment);

  // 🔥 Saada sündmus event-bus'i
  await axios.post('http://event-bus:5005/events', {
    type: 'CommentCreated',
    data: newComment,
  });

  res.status(201).json(newComment);
});

// Handle events from event-bus
app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const { postId, id, status, content } = data;

    // Leia kommentaar
    const comment = comments.find(c => c.id === id && c.postId === postId);
    if (comment) {
      comment.status = status;

      // Saada uuendatud sündmus
      await axios.post('http://event-bus:5005/events', {
        type: 'CommentUpdated',
        data: comment,
      });
    }
  }

  res.send({});
});

app.listen(5001, () =>
  console.log('Comments service running on http://localhost:5001')
);
