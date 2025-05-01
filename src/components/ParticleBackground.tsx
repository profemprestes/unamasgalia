// src/components/ParticleBackground.tsx
'use client';
import React, { useEffect, useRef, useState } from 'react';

const ParticleBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true); // Indicate client-side execution
    }, []);

    useEffect(() => {
        if (!isClient || !canvasRef.current) return; // Only run on client with canvas

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        const particleCount = 50; // Adjust particle density

        // Set canvas dimensions
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas(); // Initial size
        window.addEventListener('resize', resizeCanvas);

        // Particle class
        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            color: string;

            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1; // Particle size
                this.speedX = Math.random() * 1 - 0.5; // Horizontal speed
                this.speedY = Math.random() * 1 - 0.5; // Vertical speed
                // Use theme colors dynamically if possible, fallback to static
                const colors = ['rgba(204, 213, 174, 0.6)', 'rgba(233, 237, 201, 0.6)', 'rgba(212, 163, 115, 0.6)']; // Tea Green, Beige, Buff with opacity
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

                 // Reset particles that go too far out (alternative to bouncing)
                // if (this.x < -this.size || this.x > canvas.width + this.size || this.y < -this.size || this.y > canvas.height + this.size) {
                //    this.x = Math.random() * canvas.width;
                //    this.y = Math.random() * canvas.height;
                // }

            }

            draw() {
                 if (!ctx) return;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Initialize particles
        const initParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };
        initParticles();

        // Animation loop
        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        // Cleanup function
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
        };

    }, [isClient]); // Re-run if isClient changes

     if (!isClient) {
        return null; // Don't render canvas on server
    }


    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0, // Ensure it's behind content but visible
                pointerEvents: 'none', // Make canvas non-interactive
            }}
        />
    );
};

export default ParticleBackground;
