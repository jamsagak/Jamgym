import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/lib/queryClient';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'JamGym - Tu Guía de Ejercicios',
  description: 'Descubre ejercicios, instrucciones y rutinas para alcanzar tus objetivos fitness.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
