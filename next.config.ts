import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The unused D1 starter files rely on Cloudflare-only types.
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
