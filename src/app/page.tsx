'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/legacy/image";
import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';
import InvitationCard from '@/components/InvitationCard';
import HeroSection from '@/components/HeroSection';
import CountdownTimer from '@/components/CountdownTimer';
import RsvpModal from '@/components/RsvpModal';
import ContactModal from '@/components/ContactModal';
import MessageModal from '@/components/MessageModal';
import DaisyConfetti from '@/components/DaisyConfetti';
import PartyDetails from '@/components/PartyDetails'; // Import PartyDetails
import { MessageCircle } from 'lucide-react';
import { getGoogleMapsUrl } from '@/services/google-maps'; // Import the service

const partyDate = new Date('2025-05-10T13:00:00'); // UPDATED DATE
const partyLocation = {
  name: "Casa de Galia", // Translated
  address: "CP3W+P5H, 11000 San Marcos, Departamento de Canelones",
};
const parentContact = {
  name: "Mamá y Papá", // Translated
  phone: "+59892475455", // UPDATE THIS PHONE NUMBER
  bankDetails: "Banco: BROU, Cuenta: 001782901-00001" // UPDATE BANK DETAILS (Consider translation if needed)
};
const whatsappRsvpNumber = "+59892475455"; // UPDATE THIS WHATSAPP NUMBER

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
            title="¡El Primer Cumpleaños de Galia!" // Translated
            subtitle="¡Estás Invitado/a!" // Translated
            date={partyDate}
            locationName={partyLocation.name}
            onScrollDown={handleScrollDown}
            imageUrl="/GaliaHero.svg"
            // Removed data-ai-hint as it's not a placeholder anymore
          />
          <div id="party-details" className="py-12 md:py-20 bg-secondary">
            <div className="container mx-auto px-4 space-y-12">
                <CountdownTimer targetDate={partyDate} />
                <PartyDetails
                    date={partyDate}
                    address={partyLocation.address}
                    mapUrl={mapUrl}
                    parentsMessage="Estamos muy emocionados de celebrar el primer año de Galia con todos nuestros seres queridos. ¡Únete a nosotros para divertirnos, reír y comer pastel!" // Translated
                />
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Button onClick={() => setIsRsvpModalOpen(true)} size="lg" variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        Confirmar Asistencia
                    </Button>
                    <Button onClick={() => setIsContactModalOpen(true)} size="lg" variant="outline">
                        Contacto y Regalos
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
            <span className="sr-only">Enviar Mensaje a Galia</span>
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
