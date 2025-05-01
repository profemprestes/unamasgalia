'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';
import InvitationCard from '@/components/InvitationCard';
import HeroSection from '@/components/HeroSection';
import PartyDetails from '@/components/PartyDetails';
import CountdownTimer from '@/components/CountdownTimer';
import RsvpModal from '@/components/RsvpModal';
import ContactModal from '@/components/ContactModal';
import MessageModal from '@/components/MessageModal';
import DaisyConfetti from '@/components/DaisyConfetti';
import { MessageCircle } from 'lucide-react';
import { getGoogleMapsUrl } from '@/services/google-maps'; // Import the service

const partyDate = new Date('2024-09-15T14:00:00'); // UPDATE THIS DATE
const partyLocation = {
  name: "Galia's House",
  address: "123 Party Lane, Celebration City, FL 12345",
};
const parentContact = {
  name: "Mom & Dad",
  phone: "+1234567890", // UPDATE THIS PHONE NUMBER
  bankDetails: "Bank Name: XYZ, Account: 123456789" // UPDATE BANK DETAILS
};
const whatsappRsvpNumber = "+1234567890"; // UPDATE THIS WHATSAPP NUMBER

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showInvitation, setShowInvitation] = useState(true);
  const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [mapUrl, setMapUrl] = useState('#');

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Adjust loader duration as needed

    // Fetch Google Maps URL
    const fetchMapUrl = async () => {
      try {
        const url = await getGoogleMapsUrl(partyLocation.address);
        setMapUrl(url);
      } catch (error) {
        console.error("Error fetching Google Maps URL:", error);
        // Fallback or default URL if needed
        setMapUrl(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(partyLocation.address)}`);
      }
    };
    fetchMapUrl();

    return () => clearTimeout(timer);
  }, []);

  const handleCardClick = () => {
    setShowInvitation(false);
  };

  const handleScrollDown = () => {
    const detailsSection = document.getElementById('party-details');
    if (detailsSection) {
      detailsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
       <DaisyConfetti />
      {showInvitation ? (
        <InvitationCard onClick={handleCardClick} />
      ) : (
        <>
          <HeroSection
            title="Galia's First Birthday Bash!"
            subtitle="You're Invited!"
            date={partyDate}
            locationName={partyLocation.name}
            onScrollDown={handleScrollDown}
            imageUrl="https://picsum.photos/seed/galia_hero/1200/800"
            data-ai-hint="girl birthday party"
          />
          <div id="party-details" className="py-12 md:py-20 bg-secondary">
            <div className="container mx-auto px-4 space-y-12">
                <CountdownTimer targetDate={partyDate} />
                <PartyDetails
                    date={partyDate}
                    address={partyLocation.address}
                    mapUrl={mapUrl}
                    parentsMessage="We are so excited to celebrate Galia's first year with all our loved ones. Join us for fun, laughter, and cake!" // Customize this message
                />
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Button onClick={() => setIsRsvpModalOpen(true)} size="lg" variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        RSVP Now
                    </Button>
                    <Button onClick={() => setIsContactModalOpen(true)} size="lg" variant="outline">
                        Contact & Gifts
                    </Button>
                </div>
            </div>
          </div>

          {/* Floating Action Button for Message Modal */}
          <Button
            variant="default"
            size="icon"
            className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground z-50"
            onClick={() => setIsMessageModalOpen(true)}
          >
            <MessageCircle size={24} />
            <span className="sr-only">Send Message to Galia</span>
          </Button>

          {/* Modals */}
          <RsvpModal
            isOpen={isRsvpModalOpen}
            onClose={() => setIsRsvpModalOpen(false)}
            whatsappNumber={whatsappRsvpNumber}
            guestName="" // Or fetch guest name if possible
          />
          <ContactModal
            isOpen={isContactModalOpen}
            onClose={() => setIsContactModalOpen(false)}
            contactName={parentContact.name}
            phoneNumber={parentContact.phone}
            bankDetails={parentContact.bankDetails}
          />
          <MessageModal
            isOpen={isMessageModalOpen}
            onClose={() => setIsMessageModalOpen(false)}
          />
        </>
      )}
    </div>
  );
}
