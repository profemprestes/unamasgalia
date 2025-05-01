import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // Import Spanish locale
import ParticleBackground from './ParticleBackground'; // Import ParticleBackground

interface HeroSectionProps {
  title: string;
  subtitle: string;
  date: Date;
  locationName: string;
  imageUrl: string;
  onScrollDown: () => void;
}

const HeroSection: React.FC<HeroSectionProps & React.HTMLAttributes<HTMLDivElement>> = ({
  title,
  subtitle,
  date,
  locationName,
  imageUrl,
  onScrollDown,
  ...props // Capture any additional HTML attributes like data-ai-hint
}) => {
  const formattedDate = format(date, "EEEE d 'de' MMMM 'de' yyyy 'a las' h:mm a", { locale: es });
  // Capitalize the first letter of the day and month
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1).replace(/ de (\w)/, (match, p1) => ` de ${p1.toUpperCase()}`);


  return (
    <div className="relative h-screen flex items-center justify-center text-center text-primary-foreground overflow-hidden" {...props}>
      <ParticleBackground /> {/* Add ParticleBackground component */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="opacity-40" // Adjust opacity as needed
          priority // Load hero image quickly
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-background" />
      </div>
      <div className="relative z-10 p-4 flex flex-col items-center animate-fade-in-up">
        {/* Translated subtitle */}
        <h2 className="text-2xl md:text-3xl font-light mb-2 text-primary-foreground/80">{subtitle}</h2>
        {/* Translated title */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">{title}</h1>
        <div className="text-lg md:text-xl space-y-1 mb-8 font-medium">
           {/* Formatted and capitalized date in Spanish */}
          <p>{capitalizedDate}</p>
          <p>{locationName}</p>
        </div>
        <Button
          variant="ghost"
          size="lg"
          onClick={onScrollDown}
          className="absolute bottom-10 animate-bounce text-primary-foreground hover:bg-primary-foreground/10"
        >
           {/* Translated button text */}
          <span className="mr-2">Desliza Hacia Abajo</span>
          <ChevronDown size={24} />
        </Button>
      </div>
       <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
