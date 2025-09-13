/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // تبسيط الإعدادات لتجنب مشاكل التوافق مع Turbopack
}

export default nextConfig
