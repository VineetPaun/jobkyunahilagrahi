/** @type {import('next').NextConfig} */
const nextConfig = {
    // Updated for Next.js 16 - moved from experimental.serverComponentsExternalPackages
    serverExternalPackages: ['pdf-parse'],

    // Empty turbopack config to acknowledge we're using Turbopack
    turbopack: {},
};

module.exports = nextConfig;
