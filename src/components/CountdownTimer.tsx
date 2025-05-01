'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CountdownTimerProps {
  targetDate: Date;
}

interface TimeLeft {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const calculateTimeLeft = (): TimeLeft => {
    // Ensure targetDate is valid before calculation
    if (!(targetDate instanceof Date) || isNaN(targetDate.getTime())) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    const difference = +targetDate - +new Date();
    let timeLeft: TimeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
        // Party has started or passed
        timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure this runs only on the client after hydration
    setIsClient(true);

    // Perform initial calculation and set up interval timer only on client
    setTimeLeft(calculateTimeLeft()); // Initial calculation

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
    // Only run this effect once on mount on the client side
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs once on client mount

  if (!isClient) {
    // Render placeholder on the server to avoid hydration mismatch
    return (
       <Card className="w-full max-w-2xl mx-auto shadow-lg border-accent">
        <CardHeader>
            <CardTitle className="text-center text-2xl md:text-3xl font-semibold text-foreground">Time Until the Party!</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-around text-center p-6">
            {['days', 'hours', 'minutes', 'seconds'].map((interval) => (
            <div key={interval} className="flex flex-col items-center w-16 md:w-20">
                <span className="text-3xl md:text-5xl font-bold text-primary animate-pulse">--</span>
                <span className="text-xs md:text-sm uppercase text-muted-foreground mt-1">{interval}</span>
            </div>
            ))}
        </CardContent>
        </Card>
    );
  }

  const timerComponents: JSX.Element[] = [];

  Object.keys(timeLeft).forEach((interval) => {
    const value = timeLeft[interval as keyof TimeLeft];
    if (value === undefined) {
      return;
    }

    timerComponents.push(
      <div key={interval} className="flex flex-col items-center w-16 md:w-20">
        <span className="text-3xl md:text-5xl font-bold text-primary">
          {String(value).padStart(2, '0')}
        </span>
        <span className="text-xs md:text-sm uppercase text-muted-foreground mt-1">{interval}</span>
      </div>
    );
  });

   const isPartyTime = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 && targetDate && +targetDate <= +new Date();

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-accent">
      <CardHeader>
        <CardTitle className="text-center text-2xl md:text-3xl font-semibold text-foreground">
          {isPartyTime ? "The Party is On!" : "Time Until the Party!"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-around text-center p-6">
        {timerComponents.length ? timerComponents : <span className="text-xl text-muted-foreground">Loading timer...</span>}
      </CardContent>
    </Card>
  );
};

export default CountdownTimer;
