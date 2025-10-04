const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/proxy', async (req, res) => {
  const url = req.query.url;
  console.log('Incoming request to /proxy');
  console.log('Requested URL:', url); // Log the requested URL
  if (!url) {
    console.log('Missing URL parameter');
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  try {
    console.log('Fetching from TMDb:', url); // Log before fetch
    const response = await fetch(url);
    console.log('TMDb response status:', response.status); // Log status
    if (!response.ok) {
      console.log('TMDb error:', response.statusText);
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    console.log('TMDb response data:', data); // Log data
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: `Proxy request failed: ${error.message}` });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});
