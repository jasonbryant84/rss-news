import { parseStringPromise } from 'xml2js';

const UNLIMITED_HANGOUT_FEED = 'https://unlimitedhangout.com/feed/';

// Simple HTML sanitization using regex (no jsdom dependency)
function sanitizeHtml(html) {
  if (!html) return '';
  
  try {
    // Remove script and style tags and their contents
    let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    
    // Remove event handlers (onclick, onload, etc.)
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');
    
    // Remove javascript: protocol
    sanitized = sanitized.replace(/href\s*=\s*["']?javascript:[^"'>\s]*/gi, '');
    sanitized = sanitized.replace(/src\s*=\s*["']?javascript:[^"'>\s]*/gi, '');
    
    // Remove data: protocol (except data URIs in img tags are ok, we'll keep those)
    sanitized = sanitized.replace(/on[a-z]+\s*=\s*["']?data:[^"'>\s]*/gi, '');
    
    return sanitized;
  } catch (error) {
    console.error('Sanitization error:', error);
    return html;
  }
}

// Extract image URL from various possible locations
function getImageFromContent(content, enclosure) {
  if (!content) return null;
  
  // Try to extract from enclosure first (if available)
  if (enclosure && Array.isArray(enclosure) && enclosure[0] && enclosure[0].$.url) {
    const url = enclosure[0].$.url;
    if (isValidImageUrl(url)) {
      return url;
    }
  }
  
  // Try to extract from content HTML
  if (typeof content === 'string') {
    const imgMatch = content.match(/<img[^>]+src="?([^"\s>]+)"?/);
    if (imgMatch && imgMatch[1]) {
      const url = imgMatch[1];
      if (isValidImageUrl(url)) {
        return url;
      }
    }
  }
  
  return null;
}

// Validate image URLs
function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  
  // Check for invalid/placeholder URLs
  if (url === 'http://no' || url === 'https://no' || url.length < 10) return false;
  
  // Check for valid protocols
  if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) return false;
  
  // Check for common valid domains or local paths
  if (url.startsWith('/')) return true; // Local images
  if (url.includes('unlimitedhangout.com')) return true;
  if (url.includes('wordpress.com')) return true;
  if (url.includes('wp-content')) return true;
  
  // Reject other external domains
  return false;
}

// Proxy external image URLs through our server
function proxyImageUrl(url) {
  if (!url || url.startsWith('/')) return url; // Local images don't need proxying
  
  // Only proxy external URLs
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  }
  
  return url;
}

// Proxy all images in HTML content
function proxyContentImages(html) {
  if (!html) return html;
  
  // Replace img src attributes
  return html.replace(/<img([^>]+)src=["']([^"']+)["']/gi, (match, attrs, src) => {
    const proxiedSrc = proxyImageUrl(src);
    return `<img${attrs}src="${proxiedSrc}"`;
  });
}

// Parse RSS feed and return articles
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await fetch(UNLIMITED_HANGOUT_FEED, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.statusText}`);
    }

    const xmlText = await response.text();
    const parsed = await parseStringPromise(xmlText);

    const items = parsed.rss.channel[0].item || [];

    const articles = items.slice(0, 50).map((item, index) => {
      // Extract fields with fallbacks
      const title = item.title?.[0] || 'Untitled';
      const link = item.link?.[0] || '';
      const pubDate = item.pubDate?.[0] || new Date().toISOString();
      
      // Try multiple sources for content
      const contentEncoded = item['content:encoded']?.[0] || item.description?.[0] || '';
      const description = item.description?.[0] || '';
      
      // Prefer content:encoded, fall back to description, clean up CDATA
      let content = contentEncoded || description;
      if (content && content.startsWith('<![CDATA[')) {
        content = content.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '');
      }
      
      // Extract author
      const creatorArray = item['dc:creator'];
      const author = creatorArray?.[0] || 'Unlimited Hangout';
      
      // Extract category/tags
      const categoryArray = item.category || [];
      const categories = categoryArray.map(cat => {
        if (typeof cat === 'string') return cat;
        if (cat._ !== undefined) return cat._;
        return 'General';
      });

      const category = categories[0] || 'General';
      
      // Get image from enclosure or content
      const enclosure = item.enclosure;
      let featureImg = getImageFromContent(content, enclosure);
      
      // Fallback to a default image if none found
      if (!featureImg) {
        featureImg = '/images/placeholder.png';
      }

      // Clean and sanitize content
      const sanitizedContent = sanitizeHtml(content);
      
      // Proxy all images in content through our server
      const proxiedContent = proxyContentImages(sanitizedContent);
      
      // Strip HTML tags from description for clean excerpt
      const cleanDescription = description.replace(/<[^>]*>/g, '').trim();
      
      // Create a stable slug from the title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 100);

      return {
        slug: slug,
        title: title.substring(0, 100),
        excerpt: cleanDescription.substring(0, 200) || title.substring(0, 150),
        content: proxiedContent,
        featureImg: proxyImageUrl(featureImg),
        date: new Date(pubDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        author_name: author,
        author_img: '/images/author/author-img1.png',
        author_bio: 'Writer at Unlimited Hangout',
        author_social: [
          { icon: 'fab fa-facebook-f', url: 'https://facebook.com/unlimitedhangout' },
          { icon: 'fab fa-twitter', url: 'https://twitter.com/unlimitedhangout' }
        ],
        cate: category,
        cate_bg: 'bg-color-blue-one',
        cate_img: '/images/category/cate1.png',
        post_views: Math.floor(Math.random() * 5000) + 100,
        post_share: Math.floor(Math.random() * 100) + 10,
        postFormat: 'standard',
        story: false,
        trending: index < 5,
        link: link,
        source: 'Unlimited Hangout'
      };
    });

    res.status(200).json({
      success: true,
      count: articles.length,
      articles: articles
    });

  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch articles',
      error: error.message
    });
  }
}
