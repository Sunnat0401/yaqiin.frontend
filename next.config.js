const nextConfig = {
	images: {
		remotePatterns: [{ protocol: 'https', hostname: 'utfs.io', pathname: '**' }],
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
}

export default nextConfig
