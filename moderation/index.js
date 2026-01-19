const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if(type === 'CommentCreated') {
    const status = data.content.includes('bad') ? 'rejected' : 'approved';
    await axios.post('http://event-bus-srv:5005/events', {
      type: 'CommentModerated',
      data: { ...data, status }
    });
  }

  res.send({});
});

app.listen(5003, () => console.log('Moderation service running on port 5003'));
