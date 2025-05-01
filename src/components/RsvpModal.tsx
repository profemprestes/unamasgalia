import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sendWhatsAppMessage, WhatsappMessage } from '@/services/whatsapp'; // Import the service
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MessageSquareText } from 'lucide-react';
import { suggestInvitationMessage } from '@/ai/flows/suggest-invitation-message'; // Import AI function

interface RsvpModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber: string;
  guestName: string; // Keep guestName prop
}

const RsvpModal: React.FC<RsvpModalProps> = ({ isOpen, onClose, whatsappNumber, guestName: initialGuestName }) => {
  const [guestName, setGuestName] = useState(initialGuestName || ''); // Use state for guest name
  const [attendance, setAttendance] = useState<'yes' | 'no' | null>(null);
  const [numberOfGuests, setNumberOfGuests] = useState<number | string>(1);
  const [isSending, setIsSending] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const { toast } = useToast();

  const handleSendRsvp = async () => {
    if (!attendance) {
      toast({ title: "Por favor selecciona si asistirás", variant: "destructive" });
      return;
    }
    if (attendance === 'yes' && (!guestName || !numberOfGuests || Number(numberOfGuests) < 1)) {
      toast({ title: "Por favor ingresa tu nombre y número de invitados", variant: "destructive" });
      return;
    }
     if (attendance === 'no' && !guestName) {
      toast({ title: "Por favor ingresa tu nombre", variant: "destructive" });
      return;
    }


    let messageText = '';
    const guestsSuffix = Number(numberOfGuests) > 1 ? 'invitados' : 'invitado'; // Translate suffix
    if (attendance === 'yes') {
       messageText = `¡Hola! ${guestName} asistirá al Cumpleaños de Galia (${numberOfGuests} ${guestsSuffix}). ¡Estamos emocionados! 🎉`; // Translated message
    } else {
       messageText = `Hola, lamentablemente ${guestName} no podrá asistir al Cumpleaños de Galia. ¡Enviamos nuestros mejores deseos! ❤️`; // Translated message
    }

    const message: WhatsappMessage = {
      phoneNumber: whatsappNumber,
      message: messageText,
    };

    setIsSending(true);
    try {
      const success = await sendWhatsAppMessage(message); // Use the service function
      if (success) {
        toast({
          title: "¡Confirmación Enviada!", // Translated
          description: `Tu ${attendance === 'yes' ? 'confirmación' : 'respuesta negativa'} ha sido enviada por WhatsApp (simulado).`, // Translated
        });
        onClose(); // Close modal on success
        // Reset form state optionally
        setGuestName(initialGuestName || '');
        setAttendance(null);
        setNumberOfGuests(1);
        setSuggestedMessages([]);
      } else {
        throw new Error("Failed to send WhatsApp message");
      }
    } catch (error) {
      console.error("Error sending RSVP:", error);
      toast({
        title: "Error al Enviar Confirmación", // Translated
        description: "No se pudo enviar tu confirmación. Por favor intenta de nuevo o contacta a los anfitriones directamente.", // Translated
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleGenerateSuggestions = async () => {
    if (!attendance || !guestName) return;

    let baseMessage = '';
    const guestsSuffix = Number(numberOfGuests) > 1 ? 'invitados' : 'invitado'; // Translate suffix
     if (attendance === 'yes') {
       baseMessage = `¡Hola! ${guestName} asistirá al Cumpleaños de Galia (${numberOfGuests} ${guestsSuffix}). ¡Estamos emocionados! 🎉`; // Translated message
    } else {
       baseMessage = `Hola, lamentablemente ${guestName} no podrá asistir al Cumpleaños de Galia. ¡Enviamos nuestros mejores deseos! ❤️`; // Translated message
    }


    setIsLoadingSuggestions(true);
    setSuggestedMessages([]);
    try {
        const result = await suggestInvitationMessage({ originalMessage: baseMessage });
        setSuggestedMessages(result.suggestedMessages);
    } catch (error) {
        console.error("Error generating suggestions:", error);
        toast({
            title: "Error de IA", // Translated
            description: "No se pudieron generar sugerencias de mensaje.", // Translated
            variant: "destructive",
        });
    } finally {
        setIsLoadingSuggestions(false);
    }
  };

   const constructWhatsAppLink = () => {
    if (!attendance) return "#"; // Should not happen if button is disabled

    let messageText = '';
    const guestsSuffix = Number(numberOfGuests) > 1 ? 'invitados' : 'invitado'; // Translate suffix
     if (attendance === 'yes') {
       messageText = `¡Hola! ${guestName || 'Invitado/a'} asistirá al Cumpleaños de Galia (${numberOfGuests || 1} ${guestsSuffix}). ¡Estamos emocionados! 🎉`; // Translated message
    } else {
       messageText = `Hola, lamentablemente ${guestName || 'Invitado/a'} no podrá asistir al Cumpleaños de Galia. ¡Enviamos nuestros mejores deseos! ❤️`; // Translated message
    }

    const encodedMessage = encodeURIComponent(messageText);
    // Basic phone number cleanup (remove non-digits, keep +)
    const cleanedPhoneNumber = whatsappNumber.replace(/[^0-9+]/g, '');
    return `https://wa.me/${cleanedPhoneNumber}?text=${encodedMessage}`;
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Confirmar Asistencia</DialogTitle> {/* Translated */}
          <DialogDescription>
            ¡Avísanos si puedes venir! Confirma por WhatsApp. {/* Translated */}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
           <div className="grid grid-cols-4 items-center gap-4">
             <Label htmlFor="guestName" className="text-right col-span-1">
              Tu Nombre {/* Translated */}
             </Label>
             <Input
              id="guestName"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="col-span-3"
              placeholder="Ingresa tu(s) nombre(s)" /* Translated */
            />
           </div>

            <RadioGroup
                value={attendance ?? ""}
                onValueChange={(value) => setAttendance(value as 'yes' | 'no')}
                className="flex justify-center gap-6 pt-2"
             >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="rsvp-yes" />
                    <Label htmlFor="rsvp-yes" className="text-lg cursor-pointer">🎉 ¡Sí, voy!</Label> {/* Translated */}
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="rsvp-no" />
                    <Label htmlFor="rsvp-no" className="text-lg cursor-pointer">😢 No puedo ir</Label> {/* Translated */}
                </div>
            </RadioGroup>


          {attendance === 'yes' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="numberOfGuests" className="text-right col-span-1">
                Invitados {/* Translated */}
              </Label>
              <Input
                id="numberOfGuests"
                type="number"
                min="1"
                value={numberOfGuests}
                onChange={(e) => setNumberOfGuests(e.target.value ? parseInt(e.target.value) : '')}
                className="col-span-3"
              />
            </div>
          )}

           {/* AI Suggestions Section */}
           {attendance && guestName && (
                <div className="pt-4 border-t mt-4">
                     <Button onClick={handleGenerateSuggestions} variant="ghost" size="sm" className="w-full mb-2" disabled={isLoadingSuggestions}>
                        <MessageSquareText className="mr-2 h-4 w-4" />
                        {isLoadingSuggestions ? 'Generando...' : 'Sugerir Mensajes (IA)'} {/* Translated */}
                    </Button>
                    {isLoadingSuggestions && <p className="text-sm text-muted-foreground text-center">Generando sugerencias...</p>} {/* Translated */}
                    {suggestedMessages.length > 0 && (
                        <div className="space-y-2 mt-2">
                            <p className="text-sm font-medium text-center">Sugerencias de IA:</p> {/* Translated */}
                            {suggestedMessages.map((msg, index) => (
                                <Button key={index} variant="outline" size="sm" className="w-full text-left h-auto py-2" onClick={() => {
                                    // Update state and construct link for the suggested message
                                     const waLink = constructWhatsAppLink(); // Gets the base link
                                     const suggestedMsgEncoded = encodeURIComponent(msg);
                                     const finalLink = waLink.replace(/text=.*?$/, `text=${suggestedMsgEncoded}`); // Replace message part
                                     window.open(finalLink, '_blank');
                                     onClose();
                                }}>
                                    {msg}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
            )}

        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSending}>Cancelar</Button> {/* Translated */}
          {/* <Button onClick={handleSendRsvp} disabled={isSending || !attendance || !guestName}> */}
          {/* Use an anchor tag for direct WhatsApp link */}
          <Button asChild disabled={!attendance || !guestName}>
            <a href={constructWhatsAppLink()}
               target="_blank"
               rel="noopener noreferrer"
               onClick={onClose} // Close modal when link is clicked
            >
                 Confirmar por WhatsApp {/* Translated */}
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RsvpModal;
