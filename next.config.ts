import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pzdhzqoetioxoegrapfe.storage.supabase.co',
        // ควรใช้ pathname ที่ครอบคลุมทุก Path ที่เป็นไปได้
        pathname: '/storage/v1/s3/**', 
      },
    ],
},
};

export default nextConfig;