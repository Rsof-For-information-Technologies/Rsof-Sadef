/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['rizzui', 'react-number-format', 'react-big-calendar', 'recharts', 'rc-table'],
    images: {
        domains: ['hip-loosely-ape.ngrok-free.app'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.ngrok-free.app',
                pathname: '**',
            },
        ],
    }
}

module.exports = nextConfig
