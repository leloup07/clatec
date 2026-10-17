/** @type {import('next').NextConfig} */

// Static SEO landing pages live in public/<slug>/index.html (copied from the
// GitHub Pages site). Serve them at /<slug> so existing links keep working.
const SEO_PAGES = [
  'casp-authorization-requirements',
  'clasificacion-tokens',
  'gobernanza-compliance',
  'gobernanza-ia',
  'mica-regulation-explained',
  'regulacion-mica',
  'regulatory-sandbox-europe',
  'requisitos-autorizacion-casp',
  'sandbox-regulatorio-europa',
  'token-classification-guide',
  'tokenizacion-estructura-legal',
  'tokenization-legal-structure',
]

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
]

const nextConfig = {
  poweredByHeader: false,
  async rewrites() {
    return SEO_PAGES.map(slug => ({ source: `/${slug}`, destination: `/${slug}/index.html` }))
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/admin', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
      { source: '/api/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }] },
    ]
  },
}

module.exports = nextConfig
