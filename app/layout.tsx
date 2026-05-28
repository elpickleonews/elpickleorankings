import type { Metadata } from 'next'
import { Bricolage_Grotesque, Inter } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  weight: ['400', '500', '600', '700', '800'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://rankings.elpickleo.com'),
  title: 'Rankings de pickleball – DUPR y PPA | El Pickleo',
  description:
    'Los rankings actualizados de pickleball en español. Consulta el top de jugadores DUPR por continente y país, y el circuito profesional PPA. Actualización semanal.',
  keywords: [
    'ranking pickleball',
    'DUPR pickleball',
    'PPA tour ranking',
    'ranking pickleball latinoamerica',
    'mejores jugadores pickleball',
    'top pickleball espanol',
  ],
  openGraph: {
    title: 'Rankings de pickleball – DUPR y PPA | El Pickleo',
    description:
      'Los rankings actualizados de pickleball en español. DUPR por continente y país. PPA Tour por categoría.',
    url: 'https://rankings.elpickleo.com/',
    siteName: 'El Pickleo',
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Rankings de pickleball – DUPR y PPA | El Pickleo',
    description: 'Los rankings de pickleball en español, actualizados cada semana.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://rankings.elpickleo.com/',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <html lang="es" className={`${bricolage.variable} ${inter.variable}`}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  )
}
