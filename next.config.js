/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["rb.gy", "cdn.sanity.io", "lh3.googleusercontent.com", "store.storeimages.cdn-apple.com", "img.icons8.com"],
  },
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
  },
  // pageExtensions:['page.tsx', 'page.ts', 'page.jsx', 'page.js']
};
