import type { NextConfig } from "next";

const isGithubPages = process.env.DEPLOY_TARGET === "github-pages";
const repoBasePath = "/tamikuamar";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? repoBasePath : "",
  },
  ...(isGithubPages
    ? {
        output: "export",
        basePath: repoBasePath,
        assetPrefix: `${repoBasePath}/`,
      }
    : {}),
};

export default nextConfig;
