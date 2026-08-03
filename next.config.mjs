/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dkmqfpanxnqfkynldaaq.supabase.co",
      },
    ],
  },
};

export default nextConfig;