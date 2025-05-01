import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, CalendarPlus, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // Import Spanish locale
import { addEventToCalendar, GoogleCalendarEvent } from '@/services/google-calendar';
import { useToast } from "@/hooks/use-toast";

interface PartyDetailsProps {
  date: Date;
  address: string;
  mapUrl: string;
  parentsMessage: string;
}

const PartyDetails: React.FC<PartyDetailsProps> = ({ date, address, mapUrl, parentsMessage }) => {
  const { toast } = useToast();

  const handleAddToCalendar = async () => {
     // Basic validation for date
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        console.error("Invalid date provided to PartyDetails:", date);
        toast({
            title: "Error", // Keep error messages in English for dev clarity or translate if preferred
            description: "No se pudo agregar el evento debido a una fecha inválida.", // Translated
            variant: "destructive",
        });
        return;
    }
    const eventDetails: GoogleCalendarEvent = {
      title: "¡Primer Cumpleaños de Galia!", // Translated title
      start: date.toISOString(),
      // Assuming a 3-hour party duration, adjust as needed
      end: new Date(date.getTime() + 3 * 60 * 60 * 1000).toISOString(),
      location: address,
      description: `¡Acompáñanos a celebrar el primer cumpleaños de Galia! ${parentsMessage}`, // Translated description
    };

    try {
      const success = await addEventToCalendar(eventDetails);
      if (success) {
        toast({
          title: "¡Éxito!", // Translated
          description: "La fiesta ha sido añadida a tu Google Calendar (simulado).", // Translated
        });
      } else {
        toast({
          title: "¡Ups!", // Translated
          description: "No se pudo añadir el evento a tu calendario.", // Translated
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding event to calendar:", error);
      toast({
        title: "Error", // Keep English or translate
        description: "Ocurrió un error al intentar añadir el evento.", // Translated
        variant: "destructive",
      });
    }
  };

  // Format date in Spanish, capitalizing first letter
  const formatDatePart = (formatString: string) => {
      if (!(date instanceof Date) || isNaN(date.getTime())) return '';
      const formatted = format(date, formatString, { locale: es });
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg bg-card">
      <CardHeader>
        <CardTitle className="text-center text-3xl md:text-4xl font-semibold text-card-foreground">Detalles de la Fiesta</CardTitle> {/* Translated */}
      </CardHeader>
      <CardContent className="space-y-6 text-center md:text-left">
        <div className="md:flex md:items-center md:justify-between p-4 rounded-lg bg-muted">
           <div className="mb-4 md:mb-0 md:mr-6">
                <p className="text-lg font-medium text-foreground">
                    {/* Format date in Spanish: e.g., Sábado, 10 de Mayo de 2025 */}
                    {formatDatePart("EEEE, d 'de' MMMM 'de' yyyy")}
                </p>
                <p className="text-2xl font-bold text-primary">
                     {/* Format time in Spanish: e.g., 1:00 p. m. */}
                    {format(date, "h:mm a", { locale: es })}
                </p>
           </div>
            <Button onClick={handleAddToCalendar} variant="outline" className="w-full md:w-auto">
                <CalendarPlus className="mr-2" /> Añadir a Google Calendar {/* Translated */}
            </Button>
        </div>

        <div className="md:flex md:items-center md:justify-between p-4 rounded-lg bg-muted">
            <div className="mb-4 md:mb-0 md:mr-6">
                <p className="text-lg font-medium text-foreground">Ubicación</p> {/* Translated */}
                <p className="text-md text-muted-foreground">{address}</p>
            </div>
            <Button asChild variant="outline" className="w-full md:w-auto">
                 <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                    <MapPin className="mr-2" /> Ver en Google Maps {/* Translated */}
                 </a>
            </Button>
        </div>

         <div className="p-4 rounded-lg bg-muted">
            <CardTitle className="text-xl font-semibold mb-2 flex items-center justify-center md:justify-start">
                <MessageSquare className="mr-2 text-primary" /> Un Mensaje de los Papás {/* Translated */}
            </CardTitle>
            <CardDescription className="text-md text-muted-foreground italic">
                "{parentsMessage}"
            </CardDescription>
        </div>
      </CardContent>
    </Card>
  );
};

export default PartyDetails;
