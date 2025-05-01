// src/components/JsonLdScript.tsx
import React from 'react';

interface Location {
  name: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
}

interface EventDetails {
  name: string;
  startDate: string;
  endDate: string;
  location: Location;
  description: string;
  image: string;
  url: string;
}

interface JsonLdScriptProps {
  event: EventDetails;
}

const JsonLdScript: React.FC<JsonLdScriptProps> = ({ event }) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.name,
    "startDate": event.startDate,
    "endDate": event.endDate,
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": event.location.name,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": event.location.address.streetAddress,
        "addressLocality": event.location.address.addressLocality,
        "addressRegion": event.location.address.addressRegion,
        "postalCode": event.location.address.postalCode,
        "addressCountry": event.location.address.addressCountry,
      }
    },
    "image": [
      event.image
     ],
    "description": event.description,
    "offers": {
      "@type": "Offer",
      "url": event.url, // URL to the invitation page itself
      "price": "0", // Assuming it's free to attend
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock", // Or LimitedAvailability
      "validFrom": new Date().toISOString(), // Valid from now
    },
    "performer": { // Optional: Can represent the host or the birthday person
      "@type": "Person",
      "name": "Galia"
    },
     "organizer": { // Optional: Representing the parents organizing
      "@type": "Person",
      "name": "Galia's Parents" // Replace with actual names if desired
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default JsonLdScript;
