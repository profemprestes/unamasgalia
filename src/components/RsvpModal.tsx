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
      toast({ title: "Please select attendance", variant: "destructive" });
      return;
    }
    if (attendance === 'yes' && (!guestName || !numberOfGuests || Number(numberOfGuests) < 1)) {
      toast({ title: "Please fill in your name and number of guests", variant: "destructive" });
      return;
    }
     if (attendance === 'no' && !guestName) {
      toast({ title: "Please fill in your name", variant: "destructive" });
      return;
    }


    let messageText = '';
    if (attendance === 'yes') {
       const guestsSuffix = Number(numberOfGuests) > 1 ? 'guests' : 'guest';
       messageText = `Hi! ${guestName} will be attending Galia's Birthday Bash (${numberOfGuests} ${guestsSuffix}). We're excited! 🎉`;
    } else {
       messageText = `Hi, unfortunately ${guestName} won't be able to make it to Galia's Birthday Bash. Sending our best wishes! ❤️`;
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
          title: "RSVP Sent!",
          description: `Your ${attendance === 'yes' ? 'acceptance' : 'regret'} has been sent via WhatsApp (simulated).`,
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
        title: "Error Sending RSVP",
        description: "Could not send your RSVP. Please try again or contact the hosts directly.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleGenerateSuggestions = async () => {
    if (!attendance || !guestName) return;

    let baseMessage = '';
     if (attendance === 'yes') {
       const guestsSuffix = Number(numberOfGuests) > 1 ? 'guests' : 'guest';
       baseMessage = `Hi! ${guestName} will be attending Galia's Birthday Bash (${numberOfGuests} ${guestsSuffix}). We're excited! 🎉`;
    } else {
       baseMessage = `Hi, unfortunately ${guestName} won't be able to make it to Galia's Birthday Bash. Sending our best wishes! ❤️`;
    }


    setIsLoadingSuggestions(true);
    setSuggestedMessages([]);
    try {
        const result = await suggestInvitationMessage({ originalMessage: baseMessage });
        setSuggestedMessages(result.suggestedMessages);
    } catch (error) {
        console.error("Error generating suggestions:", error);
        toast({
            title: "AI Error",
            description: "Could not generate message suggestions.",
            variant: "destructive",
        });
    } finally {
        setIsLoadingSuggestions(false);
    }
  };

   const constructWhatsAppLink = () => {
    if (!attendance) return "#"; // Should not happen if button is disabled

    let messageText = '';
     if (attendance === 'yes') {
       const guestsSuffix = Number(numberOfGuests) > 1 ? 'guests' : 'guest';
       messageText = `Hi! ${guestName || 'Guest'} will be attending Galia's Birthday Bash (${numberOfGuests || 1} ${guestsSuffix}). We're excited! 🎉`;
    } else {
       messageText = `Hi, unfortunately ${guestName || 'Guest'} won't be able to make it to Galia's Birthday Bash. Sending our best wishes! ❤️`;
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
          <DialogTitle className="text-2xl font-semibold">RSVP for Galia's Party</DialogTitle>
          <DialogDescription>
            Let us know if you can make it! Confirm via WhatsApp.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
           <div className="grid grid-cols-4 items-center gap-4">
             <Label htmlFor="guestName" className="text-right col-span-1">
              Your Name
             </Label>
             <Input
              id="guestName"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="col-span-3"
              placeholder="Enter your name(s)"
            />
           </div>

            <RadioGroup
                value={attendance ?? ""}
                onValueChange={(value) => setAttendance(value as 'yes' | 'no')}
                className="flex justify-center gap-6 pt-2"
             >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="rsvp-yes" />
                    <Label htmlFor="rsvp-yes" className="text-lg cursor-pointer">🎉 Yes, I'm coming!</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="rsvp-no" />
                    <Label htmlFor="rsvp-no" className="text-lg cursor-pointer">😢 No, I can't make it</Label>
                </div>
            </RadioGroup>


          {attendance === 'yes' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="numberOfGuests" className="text-right col-span-1">
                Guests
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
                        {isLoadingSuggestions ? 'Generating...' : 'Suggest Messages (AI)'}
                    </Button>
                    {isLoadingSuggestions && <p className="text-sm text-muted-foreground text-center">Generating suggestions...</p>}
                    {suggestedMessages.length > 0 && (
                        <div className="space-y-2 mt-2">
                            <p className="text-sm font-medium text-center">AI Suggestions:</p>
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
          <Button variant="outline" onClick={onClose} disabled={isSending}>Cancel</Button>
          {/* <Button onClick={handleSendRsvp} disabled={isSending || !attendance || !guestName}> */}
          {/* Use an anchor tag for direct WhatsApp link */}
          <Button asChild disabled={!attendance || !guestName}>
            <a href={constructWhatsAppLink()}
               target="_blank"
               rel="noopener noreferrer"
               onClick={onClose} // Close modal when link is clicked
            >
                 Confirm via WhatsApp
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RsvpModal;
