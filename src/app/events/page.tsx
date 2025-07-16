
'use client';

import { useEffect, useState } from 'react';
import { EventCard } from "@/components/event-card";
import { getEvents } from "@/lib/data";
import { Separator } from "@/components/ui/separator";
import type { Event } from '@/lib/data';

export default function EventsPage() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setAllEvents(getEvents());
    setIsLoading(false);
  }, []);

  const now = new Date();
  const upcomingEvents = allEvents.filter(event => new Date(event.time) >= now);
  const pastEvents = allEvents.filter(event => new Date(event.time) < now).reverse();

  if (isLoading) {
    return <div className="container py-12 md:py-16 text-center">Loading events...</div>;
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-primary">
          All Events
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse our full catalog of webinars, workshops, and seminars.
        </p>
      </div>

      <div>
        <h2 className="font-headline text-3xl font-semibold tracking-tight mb-8">Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No upcoming events scheduled. Check back soon!</p>
        )}
      </div>

      <Separator className="my-12 md:my-16" />

      <div>
        <h2 className="font-headline text-3xl font-semibold tracking-tight mb-8">Past Events</h2>
        {pastEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No past events available.</p>
        )}
      </div>
    </div>
  );
}
