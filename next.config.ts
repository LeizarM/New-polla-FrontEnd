/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://192.168.3.107:9333/api/polla/:path*'
      }
    ]
  }
}

module.exports = nextConfig