import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from './providers'
import NaradAIChat from '../components/narad-ai/NaradAIChat'
import NaradAIButton from '../components/narad-ai/NaradAIButton'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'Darshana - Digital Cultural & Historical Storytelling Platform',
  description: 'Experience India\'s rich cultural heritage through AI-powered storytelling, AR/VR immersion, and interactive cultural journeys.',
  keywords: 'cultural heritage, storytelling, AI, AR/VR, tourism, education, mythology, folklore, Indian culture',
  authors: [{ name: 'Darshana Team' }],
  openGraph: {
    title: 'Darshana - Digital Cultural Storytelling',
    description: 'Reimagine heritage through immersive AI-powered cultural experiences',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Darshana - Digital Cultural Storytelling',
    description: 'Experience Indian heritage like never before',
  },
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>
          {children}
          <NaradAIChat />
          {/* Floating Narad AI Button */}
          <div className="fixed bottom-6 right-6 z-50">
            <NaradAIButton />
          </div>
        </Providers>
      </body>
    </html>
  )
}