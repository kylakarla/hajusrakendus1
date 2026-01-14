const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/events', async (req, res) => {
  const event = req.body;
  console.log('Received event:', event);

  // Forward the event to all services
  try {
    await axios.post('http://localhost:5000/events', event); // posts
    await axios.post('http://localhost:5001/events', event); // comments
    await axios.post('http://localhost:5002/events', event); // query
  } catch (err) {
    console.error('Error sending event:', err.message);
  }

  res.send({ status: 'OK' });
});

app.listen(5005, () => console.log('Event bus running on http://localhost:5005'));
