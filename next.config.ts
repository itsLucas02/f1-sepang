import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Dev-only: allow the sandboxed/proxied preview hosts to request /_next/*
  // assets. Without this Next 16 answers 403 cross-origin, so the client
  // bundle never loads and nothing hydrates.
  allowedDevOrigins: [
    "*.e2b.app",
    "*.arena.ai",
    "*.github.dev",
    "*.gitpod.io",
    "localhost",
    "127.0.0.1",
  ],
};

export default nextConfig;
