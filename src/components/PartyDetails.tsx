import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, CalendarPlus, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
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
            title: "Error",
            description: "Could not add event due to an invalid date.",
            variant: "destructive",
        });
        return;
    }
    const eventDetails: GoogleCalendarEvent = {
      title: "Galia's First Birthday Bash!",
      start: date.toISOString(),
      // Assuming a 3-hour party duration, adjust as needed
      end: new Date(date.getTime() + 3 * 60 * 60 * 1000).toISOString(),
      location: address,
      description: `Join us to celebrate Galia's first birthday! ${parentsMessage}`,
    };

    try {
      const success = await addEventToCalendar(eventDetails);
      if (success) {
        toast({
          title: "Success!",
          description: "Party added to your Google Calendar (simulated).",
        });
      } else {
        toast({
          title: "Uh oh!",
          description: "Could not add the event to your calendar.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding event to calendar:", error);
      toast({
        title: "Error",
        description: "An error occurred while trying to add the event.",
        variant: "destructive",
      });
    }
  };


  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg bg-card">
      <CardHeader>
        <CardTitle className="text-center text-3xl md:text-4xl font-semibold text-card-foreground">Party Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-center md:text-left">
        <div className="md:flex md:items-center md:justify-between p-4 rounded-lg bg-muted">
           <div className="mb-4 md:mb-0 md:mr-6">
                <p className="text-lg font-medium text-foreground">
                    {format(date, "EEEE, MMMM d, yyyy")}
                </p>
                <p className="text-2xl font-bold text-primary">
                    {format(date, "h:mm a")}
                </p>
           </div>
            <Button onClick={handleAddToCalendar} variant="outline" className="w-full md:w-auto">
                <CalendarPlus className="mr-2" /> Add to Google Calendar
            </Button>
        </div>

        <div className="md:flex md:items-center md:justify-between p-4 rounded-lg bg-muted">
            <div className="mb-4 md:mb-0 md:mr-6">
                <p className="text-lg font-medium text-foreground">Location</p>
                <p className="text-md text-muted-foreground">{address}</p>
            </div>
            <Button asChild variant="outline" className="w-full md:w-auto">
                 <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                    <MapPin className="mr-2" /> View on Google Maps
                 </a>
            </Button>
        </div>

         <div className="p-4 rounded-lg bg-muted">
            <CardTitle className="text-xl font-semibold mb-2 flex items-center justify-center md:justify-start">
                <MessageSquare className="mr-2 text-primary" /> A Note from the Parents
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
