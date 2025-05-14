/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["img.freepik.com", "veterinaire-tour-hassan.com"],
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.node/,
            use: "raw-loader",
        });
        return config;
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/albums?pageSize=20&current=1',
                permanent: false,
            },
        ];
    },
};

module.exports = nextConfig
