import createNextIntlPlugin from 'next-intl/plugin';

/**
 * @type {import('next').NextConfig}
 */

const withNextIntl = createNextIntlPlugin()

const nextConfig = {
  transpilePackages: ['rizzui', 'react-number-format', 'react-big-calendar', 'recharts', 'rc-table'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.ngrok-free.app',
                pathname: '**',
            },
        ],
    }
}
 
export default withNextIntl(nextConfig)

