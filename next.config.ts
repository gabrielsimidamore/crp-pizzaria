import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Não bloqueia o build de produção por erros de lint
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
