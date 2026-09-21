import { routes, siteUrl } from '@/data/profile';

// The route list and its lastmod dates live in profile.js, so the nav and this file can't disagree.
export default function sitemap() {
  return routes.map((route) => ({
    url: `${siteUrl}${route.href === '/' ? '' : route.href}`,
    lastModified: new Date(route.updated),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
