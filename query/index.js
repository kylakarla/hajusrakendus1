const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {}; 
// Struktuur: 
// posts = {
//   "postId123": { id: "postId123", title: "Post title", comments: [ { id: "commentId", content: "..." } ] }
// }

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId } = data;
    const post = posts[postId];
    if (post) {
      post.comments.push({ id, content });
    }
  }
  
  if (type === 'CommentUpdated') {
  const { id, postId, status, content } = data;
  const post = posts[postId];

  const comment = post.comments.find(comment => comment.id === id);
  comment.status = status;
  comment.content = content;
}

  res.send({});
});

app.listen(5002, () => {
  console.log('Query service running on port 5002');
});
