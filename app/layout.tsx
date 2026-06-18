import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Grand jeu pronostics football 2026',
  description: 'Pronostiquez les matchs du jour et tentez de gagner un jeu de boules.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
