import './globals.css';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { MobileBar } from '@/components/site/MobileBar';
import { getSettings } from '@/lib/store';

const serif = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-serif', display: 'swap' });
const sans = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-sans', display: 'swap' });

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(SITE),
  title: { default: 'Srivani Book Stall – Books, Stationery & Xerox in Karimnagar', template: '%s | Srivani Book Stall' },
  description: 'Search 1,500+ books and stationery at Srivani Book Stall, Karimnagar. School books, competitive exam books, notebooks, pens and more — enquire on WhatsApp.',
  openGraph: { type: 'website', siteName: 'Srivani Book Stall', locale: 'en_IN' },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export const revalidate = 60;

export const viewport = { themeColor: '#D97706', width: 'device-width', initialScale: 1 };

export default async function RootLayout({ children }) {
  const settings = await getSettings();
  const localBusiness = {
    '@context': 'https://schema.org', '@type': 'BookStore', name: settings.storeName, telephone: settings.phone, url: SITE,
    address: { '@type': 'PostalAddress', streetAddress: settings.address, addressLocality: settings.city, addressRegion: 'Telangana', postalCode: '505001', addressCountry: 'IN' },
    openingHours: 'Mo-Su 09:00-20:30', foundingDate: String(settings.established), priceRange: '₹',
    aggregateRating: settings.reviewCount ? { '@type': 'AggregateRating', ratingValue: settings.rating, reviewCount: settings.reviewCount } : undefined,
  };
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-screen pb-20 md:pb-0">
        <Header settings={settings} />
        <main>{children}</main>
        <Footer settings={settings} />
        <MobileBar settings={settings} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
      </body>
    </html>
  );
}
