import './globals.css';
import { Providers } from './providers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PulseIQ — Transform Social Data Into Intelligent Decisions.',
  description: 'A premium operating-system-like social analytics command center. Monitor growth curves, plan calendars, and query contextual metrics using Google Gemini AI.',
  keywords: ['Social Media Analytics', 'AI Command Center', 'Gemini AI', 'Content Calendar', 'SaaS platform', 'Youssef Manssouri', 'PulseIQ'],
  authors: [{ name: 'By Youssef Manssouri' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220%22 width=%22100%22 height=%22100%22><text y=%220.9em%22 font-size=%2290%22>🌊</text></svg>" />
      </head>
      <body className="antialiased min-h-screen bg-background-light dark:bg-background-dark selection:bg-blue-500/30">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
