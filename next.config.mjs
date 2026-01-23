/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        optimizePackageImports: ['@clerk/nextjs', 'lucide-react', '@radix-ui/react-icons'],
    },
    // Enable SWC minification for faster builds
    swcMinify: true,
    // Optimize images
    images: {
        formats: ['image/avif', 'image/webp'],
    },
    // Reduce bundle size
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
};

export default nextConfig;
