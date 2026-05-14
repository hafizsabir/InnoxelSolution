import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@mui/material', '@mui/icons-material', '@mui/system', '@mui/utils'],
  // Next.js 16 uses Turbopack by default
  turbopack: {
    resolveAlias: {
      // pdfjs-dist needs canvas in Node; stub it for browser bundles
      canvas: { browser: './src/empty.js' },
    },
  },
};

export default nextConfig;


