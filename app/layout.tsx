import { ChildProps } from '@/types'
import './globals.css'

import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import React, { FC } from 'react'
import Navbar from '@/components/shared/navbar'
import { Toaster } from '@/components/ui/toaster'
import SessionProvider from '@/components/providers/session.provider'
import NextjsTopLoader from 'nextjs-toploader'

const montserrat = Montserrat({
	weight: ['400', '500', '600', '700', '800', '900'],
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Seleor elektron savdo',
	description: 'Next.js bilan qurilgan Seleor elektron savdo veb-sayti',
	icons: { icon: '/favicon.png' },
}

const RootLayout: FC<ChildProps> = ({ children }) => {
	return (
		<SessionProvider>
			<html lang='uz'>
				<body className={`${montserrat.className} antialiased`}>
					<Navbar />
					<main className='container max-w-6xl mt-24'>{children}</main>
					<Toaster />
					<NextjsTopLoader showSpinner={false}/>
				</body>
			</html>
		</SessionProvider>
	)
}

export default RootLayout
