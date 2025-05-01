// src/components/DaisyConfetti.tsx
'use client';
import React, { useEffect, useState } from 'react';

const DaisyConfetti: React.FC = () => {
  const [confettiPieces, setConfettiPieces] = useState<JSX.Element[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Indicate client-side execution

    if (typeof window !== 'undefined') { // Check if running in browser
        const pieces: JSX.Element[] = [];
        const colors = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--background))']; // Use theme colors
        const numConfetti = 50; // Number of confetti pieces

        for (let i = 0; i < numConfetti; i++) {
            const style: React.CSSProperties = {
            left: `${Math.random() * 100}vw`,
            animationDelay: `${Math.random() * 5}s`, // Start at different times
            animationDuration: `${Math.random() * 3 + 4}s`, // Vary fall speed
             '--confetti-color': colors[Math.floor(Math.random() * colors.length)], // Set color via CSS variable
             transform: `scale(${Math.random() * 0.5 + 0.5})`, // Vary size slightly
             zIndex: 1 // Ensure confetti is behind interactive elements if needed
            };
            pieces.push(<div key={i} className="confetti" style={style}></div>);
        }
        setConfettiPieces(pieces);
    }

  }, []); // Run only once on mount


  if (!isClient) {
    return null; // Don't render on the server
  }


  return <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">{confettiPieces}</div>;
};

export default DaisyConfetti;
