
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EventCard } from '@/components/event-card';
import { getEvents } from '@/lib/data';
import { ArrowRight, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Event } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const allEvents = getEvents();
    const now = new Date();
    const futureEvents = allEvents.filter(event => new Date(event.time) >= now);
    setUpcomingEvents(futureEvents);
    setIsLoading(false);
  }, []);

  return (
    <div className="flex flex-col">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-secondary">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                  GDG Connect Streamline
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Discover, register for, and engage with tech seminars and webinars from Google Developer Groups worldwide.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="#upcoming-events">
                  <Button size="lg">
                    Explore Events
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="lg" variant="outline">
                    Join Now
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <Users className="h-48 w-48 text-primary/30" />
            </div>
          </div>
        </div>
      </section>
      
      <section id="upcoming-events" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Upcoming Events</div>
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Join Our Next Session</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Stay ahead of the curve with our expert-led events. Browse our upcoming schedule and save your spot.
              </p>
            </div>
          </div>
          <div className="mx-auto grid grid-cols-1 gap-8 py-12 sm:grid-cols-2 md:grid-cols-3 lg:gap-12">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                 <Card key={i} className="flex h-full flex-col">
                  <CardHeader className="p-0">
                    <Skeleton className="h-48 w-full" />
                  </CardHeader>
                  <CardContent className="flex-grow p-6">
                    <Skeleton className="h-4 w-1/4 mb-2" />
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                       <Skeleton className="h-4 w-1/2" />
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                     <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))
            ) : (
              upcomingEvents.slice(0, 3).map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            )}
          </div>
           <div className="flex justify-center">
             <Link href="/events">
               <Button variant="secondary">
                View All Events
               </Button>
             </Link>
           </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Built for the Tech Community
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform provides the tools you need to connect with the global GDG community, learn new skills, and grow your network.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
             <Link href="/signup">
              <Button className="w-full">
                Create Your Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
