const express = require('express');
const fetch = require('node-fetch');
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
    // Ensure the URL is properly encoded to handle special characters
    const encodedUrl = encodeURI(url);
    console.log('Fetching from TMDb:', encodedUrl);
    const response = await fetch(encodedUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });
    console.log('TMDb response status:', response.status);
    if (!response.ok) {
      console.log('TMDb error:', response.statusText);
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    console.log('TMDb response data:', data);
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: `Proxy request failed: ${error.message}` });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});
