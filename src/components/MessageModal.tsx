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
      toast({ title: "Por favor completa tu nombre y mensaje", variant: "destructive" }); // Translated
      return;
    }

    setIsSending(true);
    try {
      // Simulate sending message
      console.log(`Simulando envío de mensaje de ${senderName}: ${message}`); // Translated
      // Replace with actual API call:
      // const success = await sendGaliaMessage({ senderName, message });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      const success = true; // Assume success for simulation

      if (success) {
        toast({
          title: "¡Mensaje Enviado!", // Translated
          description: "Tu mensaje para Galia ha sido enviado (simulado).", // Translated
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
        title: "Error al Enviar Mensaje", // Translated
        description: "No se pudo enviar tu mensaje. Por favor, intenta de nuevo.", // Translated
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
          <DialogTitle className="text-2xl font-semibold">Enviar un Mensaje a Galia</DialogTitle> {/* Translated */}
          <DialogDescription>
            ¡Deja un lindo mensaje para el primer cumpleaños de Galia! {/* Translated */}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
           <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="senderName">Tu Nombre</Label> {/* Translated */}
              <Input
                id="senderName"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Ingresa tu nombre" // Translated
                disabled={isSending}
               />
            </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="message">Tu Mensaje</Label> {/* Translated */}
            <Textarea
              id="message"
              placeholder="Escribe tu mensaje aquí..." // Translated
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              disabled={isSending}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSending}>Cancelar</Button> {/* Translated */}
          <Button onClick={handleSendMessage} disabled={isSending || !senderName || !message}>
            {isSending ? 'Enviando...' : 'Enviar Mensaje'} {/* Translated */}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MessageModal;
