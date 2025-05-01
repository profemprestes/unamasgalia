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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
// Assume a service function exists to handle message submission
// import { sendGaliaMessage } from '@/services/messages';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ isOpen, onClose }) => {
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
     if (!senderName || !message) {
      toast({ title: "Please fill in your name and message", variant: "destructive" });
      return;
    }

    setIsSending(true);
    try {
      // Simulate sending message
      console.log(`Simulating sending message from ${senderName}: ${message}`);
      // Replace with actual API call:
      // const success = await sendGaliaMessage({ senderName, message });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      const success = true; // Assume success for simulation

      if (success) {
        toast({
          title: "Message Sent!",
          description: "Your message for Galia has been sent (simulated).",
        });
        onClose(); // Close modal on success
        // Reset form
        setSenderName('');
        setMessage('');
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error Sending Message",
        description: "Could not send your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Send a Message to Galia</DialogTitle>
          <DialogDescription>
            Leave a sweet message for Galia's first birthday!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
           <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="senderName">Your Name</Label>
              <Input
                id="senderName"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Enter your name"
                disabled={isSending}
               />
            </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="message">Your Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              disabled={isSending}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSending}>Cancel</Button>
          <Button onClick={handleSendMessage} disabled={isSending || !senderName || !message}>
            {isSending ? 'Sending...' : 'Send Message'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MessageModal;
