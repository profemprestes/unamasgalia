import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface InvitationCardProps {
  onClick: () => void;
}

const InvitationCard: React.FC<InvitationCardProps> = ({ onClick }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-secondary to-background">
      <Card className="w-full max-w-md overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105 cursor-pointer group bg-card border-accent" onClick={onClick}>
        <CardContent className="p-0">
          <div className="relative aspect-[3/4]">
            <Image
              src="https://picsum.photos/seed/galia_card/600/800"
              alt="Primer Cumpleaños de Galia"
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-500 group-hover:scale-110"
              data-ai-hint="cute baby girl birthday"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-primary-foreground">
              <p className="text-lg font-light">Estás invitado/a a</p>
              <h1 className="text-4xl font-bold tracking-tight mb-2 text-white">¡El Primer Cumpleaños de Galia!</h1>
              <p className="text-sm opacity-80 group-hover:opacity-100 transition-opacity duration-300">Haz clic para abrir</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvitationCard;
