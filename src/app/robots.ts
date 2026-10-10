import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/privacy', '/terms', '/accessibility'],
        disallow: ['/chat', '/api/', '/login'],
      },
    ],
    sitemap: 'https://signbridge.ai/sitemap.xml',
  };
}
