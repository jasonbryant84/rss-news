// Image proxy endpoint to serve external images through your server
// Usage: /api/image-proxy?url=<encoded-image-url>

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ message: 'URL parameter is required' });
  }

  try {
    // Fetch the image from the original source
    const response = await fetch(decodeURIComponent(url), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Get the content type from the original response
    const contentType = response.headers.get('content-type');
    
    // Get the image buffer
    const imageBuffer = await response.arrayBuffer();

    // Set cache headers (cache for 7 days)
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    res.setHeader('Content-Type', contentType || 'image/jpeg');
    
    // Send the image
    res.send(Buffer.from(imageBuffer));

  } catch (error) {
    console.error('Image proxy error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch image',
      error: error.message
    });
  }
}

// Increase the body size limit for images
export const config = {
  api: {
    responseLimit: '8mb',
  },
};
