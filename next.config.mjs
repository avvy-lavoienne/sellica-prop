/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: ""
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "pub-b7fd9c30cdbf439183b75041f5f71b92.r2.dev",
        port: ""
      },
      {
        protocol: "https",
        hostname: "yrssspoimsxpibcbeaca.supabase.co",
        port: "", // Kosongkan jika tidak menggunakan port khusus
        pathname: "/storage/v1/object/public/avatars/**", // Pola URL untuk gambar di bucket avatars
      }
    ]
  }
};

export default nextConfig;
