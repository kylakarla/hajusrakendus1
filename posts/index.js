const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

let posts = [];
let lastId = 0;

app.get('/posts', (req, res) => res.json(posts));

app.post('/posts', async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content)
    return res.status(400).json({ error: 'Title and content are required' });

  const newPost = { id: ++lastId, title, content };
  posts.push(newPost);

  // 🔥 Send event to event bus
  await axios.post('http://localhost:5005/events', {
    type: 'PostCreated',
    data: newPost,
  });

  res.status(201).json(newPost);
});

app.post('/events', (req, res) => {
  console.log('Received event:', req.body);
  res.send({});
});

app.listen(5000, () => console.log('Posts service running on http://localhost:5000'));
