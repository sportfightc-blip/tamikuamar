import type { NextConfig } from "next";

const isGithubPages = process.env.DEPLOY_TARGET === "github-pages";
const repoBasePath = "/tamikuamar";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  ...(isGithubPages
    ? {
        output: "export",
        basePath: repoBasePath,
        assetPrefix: `${repoBasePath}/`,
      }
    : {}),
};

export default nextConfig;
