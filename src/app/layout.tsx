import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { getAppUrl } from '@/lib/utils/env';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: '#07090e',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(getAppUrl()),
  title: 'SignBridge AI — AI-Powered Sign Language Communication Platform',
  description:
    'Real-time sign language recognition, audio transcription, and assistive conversational AI bridging Deaf and hearing communicators worldwide.',
  keywords: [
    'sign language recognition',
    'AI accessibility',
    'ASL translation',
    'speech transcription',
    'multimodal AI',
    'Three.js accessibility',
    'Deaf communication',
  ],
  authors: [{ name: 'SignBridge Engineering Team' }],
  openGraph: {
    title: 'SignBridge AI — AI-Powered Sign Language Communication Platform',
    description:
      'Real-time sign language recognition, audio transcription, and assistive conversational AI bridging Deaf and hearing communicators.',
    type: 'website',
    url: 'https://signbridge.ai',
    siteName: 'SignBridge AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SignBridge AI',
    description: 'Bridging gesture and speech with multimodal conversational AI.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#07090e] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
