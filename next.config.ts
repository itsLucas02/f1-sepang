import type { NextConfig } from "next";

const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const pagesBasePath =
  isGitHubActions && repositoryName ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  basePath: pagesBasePath,
  assetPrefix: pagesBasePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: pagesBasePath,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
