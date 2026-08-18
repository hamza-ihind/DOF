import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata: Metadata = {
  title: 'Defenders of Future | Association in Biougra, Morocco',
  description: 'Defenders of Future is a non-profit association based in Biougra, Morocco, refurbishing schools in forgotten villages, delivering food & essential packages, and drilling clean water wells ("Spring of Life").',
  keywords: [
    'Defenders of Future',
    'Biougra',
    'Morocco Association',
    'School Refurbishment Morocco',
    'Spring of Life Well Drilling',
    'Forgotten Villages Morocco',
    'Food Distribution Biougra'
  ],
  authors: [{ name: 'Defenders of Future Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col min-h-screen transition-colors duration-300">
        <ThemeProvider>
          <LanguageProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
