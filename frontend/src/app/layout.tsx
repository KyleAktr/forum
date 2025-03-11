import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forum',
  description: 'Forum de discussion',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
