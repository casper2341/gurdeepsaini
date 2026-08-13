import { siteUrl } from './data/profile';

export default function sitemap() {
  const lastModified = new Date();
  const routes = ['', '/about', '/projects', '/experience', '/contact'];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: route === '' ? 'monthly' : 'yearly',
    priority: route === '' ? 1 : 0.8,
  }));
}
