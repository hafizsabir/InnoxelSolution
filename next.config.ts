import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@mui/material', '@mui/icons-material', '@mui/system', '@mui/utils'],
};

export default nextConfig;
