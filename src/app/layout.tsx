import type {Metadata} from 'next';
import { GeistSans } from 'geist/font/sans';
// Removed GeistMono as it's not found
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import JsonLdScript from '@/components/JsonLdScript'; // Import the JSON-LD component

// Event details for JSON-LD
const partyDetails = {
  name: "Galia's First Birthday Bash!",
  startDate: "2025-05-10T13:00:00-04:00", // Updated date/time
  endDate: "2025-05-10T18:00:00-04:00", // Updated date/time (assuming 3 hour duration)
  location: {
    name: "Galia Cumple",
    address: {
      streetAddress: "Ruta 5 Km 38.200, Juanicó, Canelones",
      addressLocality: "Club Ciclista Juanico",
      addressRegion: "UY",
      postalCode: "12345",
      addressCountry: "UY",
    },
  },
  description: "Join us to celebrate Galia's first birthday!",
  image: "/hero.svg", // Example image - UPDATE THIS
  url: "https://your-invitation-url.com", // UPDATE THIS with the actual deployment URL
};

export const metadata: Metadata = {
  title: "Galia's First Birthday Bash!",
  description: "You're invited to celebrate Galia's first birthday!",
  metadataBase: new URL('https://galiacumple.com'),
  // Add Open Graph and Twitter card metadata for better sharing
  openGraph: {
    title: partyDetails.name,
    description: partyDetails.description,
    url: partyDetails.url,
    images: [
      {
        url: partyDetails.image,
        width: 1200,
        height: 630,
        alt: "Galia's First Birthday Invitation",
      },
    ],
    type: 'website', // Or 'event' if more appropriate, though 'website' is safer
  },
  twitter: {
    card: 'summary_large_image',
    title: partyDetails.name,
    description: partyDetails.description,
    images: [partyDetails.image],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <head>
        <JsonLdScript event={partyDetails} />
      </head>
      {/* Added suppressHydrationWarning to potentially mitigate extension-related issues */}
      <body className="antialiased bg-background min-h-screen flex flex-col" suppressHydrationWarning={true}>
        <main className="flex-grow relative overflow-hidden">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
