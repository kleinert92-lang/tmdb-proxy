const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/proxy', async (req, res) => {
  const { query, api_key, language, include_adult, media_type, id, region } = req.query;
  console.log('Incoming request to /proxy');
  console.log('Query parameters:', { query, api_key, language, include_adult, media_type, id, region });

  if (!api_key) {
    console.log('Missing api_key parameter');
    return res.status(400).json({ error: 'Missing api_key parameter' });
  }

  try {
    let tmdbUrl;
    if (query) {
      // Search endpoint
      if (!query) {
        console.log('Missing query parameter for search');
        return res.status(400).json({ error: 'Missing query parameter for search' });
      }
      tmdbUrl = `https://api.themoviedb.org/3/search/multi?api_key=${api_key}&query=${encodeURIComponent(query)}&language=${language || 'en-US'}&include_adult=${include_adult || 'false'}`;
    } else if (media_type && id) {
      // Watch providers endpoint
      tmdbUrl = `https://api.themoviedb.org/3/${media_type}/${id}/watch/providers?api_key=${api_key}&region=${region || 'US'}`;
    } else {
      console.log('Invalid parameters: provide query or media_type and id');
      return res.status(400).json({ error: 'Invalid parameters: provide query or media_type and id' });
    }

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
