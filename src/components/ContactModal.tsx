import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, Gift, Copy } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactName: string;
  phoneNumber: string;
  bankDetails: string;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, contactName, phoneNumber, bankDetails }) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: `${label} Copied!`,
        description: `${text} copied to clipboard.`,
      });
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      toast({
        title: "Copy Failed",
        description: "Could not copy text to clipboard.",
        variant: "destructive",
      });
    });
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Contact & Gift Info</DialogTitle>
          <DialogDescription>
            Information for questions or if you'd like to send a gift.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
             <h3 className="text-lg font-medium flex items-center text-foreground">
                 <Phone className="mr-2 h-5 w-5 text-primary" /> Contact ({contactName})
             </h3>
             <div className="flex items-center justify-between p-3 rounded-md bg-muted">
                <a href={`tel:${phoneNumber}`} className="text-muted-foreground hover:text-primary transition-colors">{phoneNumber}</a>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(phoneNumber, 'Phone Number')}>
                    <Copy className="h-4 w-4" />
                     <span className="sr-only">Copy phone number</span>
                </Button>
             </div>
          </div>
           <div className="space-y-2">
             <h3 className="text-lg font-medium flex items-center text-foreground">
                <Gift className="mr-2 h-5 w-5 text-primary" /> Gift Information (Optional)
             </h3>
             <p className="text-sm text-muted-foreground pb-2">
                Your presence is the greatest gift! However, if you wish to contribute, here are the details.
            </p>
             <div className="flex items-center justify-between p-3 rounded-md bg-muted">
                <span className="text-muted-foreground">{bankDetails}</span>
                 <Button variant="ghost" size="icon" onClick={() => copyToClipboard(bankDetails, 'Bank Details')}>
                    <Copy className="h-4 w-4" />
                     <span className="sr-only">Copy bank details</span>
                </Button>
             </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
