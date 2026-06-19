import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Grand jeu pronostics Coupe du monde 2026 - Distri Concept",
  description: "Participez au jeu concours de pronostics football 2026 et tentez de remporter un jeu de boules Obut."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
