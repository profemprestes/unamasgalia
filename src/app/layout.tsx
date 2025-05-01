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
  endDate: "2025-05-10T16:00:00-04:00", // Updated date/time (assuming 3 hour duration)
  location: {
    name: "Galia's House",
    address: {
      streetAddress: "123 Party Lane",
      addressLocality: "Celebration City",
      addressRegion: "FL",
      postalCode: "12345",
      addressCountry: "US",
    },
  },
  description: "Join us to celebrate Galia's first birthday!",
  image: "https://picsum.photos/seed/galia_hero/1200/630", // Example image - UPDATE THIS
  url: "https://your-invitation-url.com", // UPDATE THIS with the actual deployment URL
};

export const metadata: Metadata = {
  title: "Galia's First Birthday Bash!",
  description: "You're invited to celebrate Galia's first birthday!",
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
      <body className="antialiased bg-background min-h-screen flex flex-col">
        <main className="flex-grow relative overflow-hidden">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
