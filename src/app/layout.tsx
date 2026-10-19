import type { Metadata } from 'next';
import { Cormorant_Garamond, Instrument_Serif, Inter } from 'next/font/google';
import Script from 'next/script';
import { AppProvider } from '@/components/providers/app-provider';
import { THEME_INIT_SCRIPT } from '@/data/config/theme';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument-serif',
  display: 'swap',
});

// Instrument Serif has no Cyrillic; this covers Russian headings and loads only when needed
const cormorantGaramond = Cormorant_Garamond({
  subsets: ['cyrillic'],
  weight: '400',
  variable: '--font-cormorant-garamond',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: 'Moqanni',
  description: 'Moqanni — a builder of flows',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${cormorantGaramond.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
