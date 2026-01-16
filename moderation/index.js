const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Kuulab kõik sündmused event-bus'ist
app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentCreated') {
    // Kui kommentaar sisaldab sõna 'orange' → rejected, muidu approved
    const status = data.content.includes('orange') ? 'rejected' : 'approved';

    // Saadab sündmuse tagasi event-bus'ile
    await axios.post('http://localhost:5005/events', {
      type: 'CommentModerated',
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content,
      },
    });
  }

  res.send({});
});

app.listen(5003, () =>
  console.log('Moderation service running on port 5003')
);
