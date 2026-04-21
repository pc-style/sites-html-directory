import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    "/*": ["./sites/**/*.html"],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
