const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/proxy', async (req, res) => {
  const url = req.query.url;
  console.log('Incoming request to /proxy');
  console.log('Requested URL:', url);
  if (!url) {
    console.log('Missing URL parameter');
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  try {
    console.log('Fetching from TMDb:', url);
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/json'
      }
    });
    console.log('TMDb response status:', response.status);
    console.log('TMDb response data:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: `Proxy request failed: ${error.message}` });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});
