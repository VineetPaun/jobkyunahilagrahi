import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    experimental: {
        serverComponentsExternalPackages: ["pdf-parse", "@langchain/community"],
    },
    webpack: (config) => {
        // Ignore node-specific modules when bundling for the browser
        config.resolve.alias = {
            ...config.resolve.alias,
            canvas: false,
        };
        return config;
    },
};

export default nextConfig;
