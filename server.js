const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/proxy', async (req, res) => {
  const { query, api_key, language, include_adult } = req.query;
  console.log('Incoming request to /proxy');
  console.log('Query parameters:', { query, api_key, language, include_adult });

  if (!api_key || !query) {
    console.log('Missing api_key or query parameter');
    return res.status(400).json({ error: 'Missing api_key or query parameter' });
  }

  try {
    const tmdbUrl = `https://api.themoviedb.org/3/search/multi?api_key=${api_key}&query=${encodeURIComponent(query)}&language=${language || 'en-US'}&include_adult=${include_adult || 'false'}`;
    console.log('Fetching from TMDb:', tmdbUrl);
    const response = await axios.get(tmdbUrl, {
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
