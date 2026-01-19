const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/events', async (req, res) => {
  const event = req.body;
  console.log('Received event:', event);

  try {
    await axios.post('http://posts:5000/events', event);
    await axios.post('http://comments:5001/events', event);
    await axios.post('http://query:5002/events', event);
    await axios.post('http://moderation:5003/events', event);
  } catch (err) {
    console.error('Error sending event:', err.message);
  }

  res.send({ status: 'OK' });
});

app.listen(5005, () =>
  console.log('Event bus running on port 5005')
);
