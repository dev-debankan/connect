
'use client';

import React, { useState, useEffect } from 'react';
import { getEventById, getUserById, updateUser, updateEvent, type Event, type User } from '@/lib/data';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User as UserIcon, Tag, Ticket, CheckCircle, Loader2 } from 'lucide-react';
import EventAssistant from '@/components/event-assistant';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setIsLoggedIn(true);
      const { id: userId } = JSON.parse(storedUser);
      setUser(getUserById(userId) || null);
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const eventData = getEventById(id);
    if (eventData) {
      setEvent(eventData);
    }
  }, [id]);

  useEffect(() => {
    if (user && event) {
      setIsRegistered(user.registeredEvents.includes(event.id));
    } else {
      setIsRegistered(false);
    }
  }, [user, event]);

  const handleRegister = () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    if (!user || !event) return;

    let updatedUser: User;
    let updatedEvent: Event;
    let toastMessage: string;

    if (isRegistered) {
      // Unregister
      updatedUser = {
        ...user,
        registeredEvents: user.registeredEvents.filter(eventId => eventId !== event.id),
      };
      updatedEvent = {
        ...event,
        registrations: event.registrations.filter(userId => userId !== user.id),
      };
      toastMessage = "You have successfully unregistered from this event.";
    } else {
      // Register
      updatedUser = {
        ...user,
        registeredEvents: [...user.registeredEvents, event.id],
      };
      updatedEvent = {
        ...event,
        registrations: [...event.registrations, user.id],
      };
      toastMessage = "You have successfully registered for this event!";
    }

    updateUser(updatedUser);
    updateEvent(updatedEvent);
    
    // Persist the change in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('loggedInUser', JSON.stringify({ id: updatedUser.id, role: updatedUser.role }));
    }

    // Update the state to reflect the change immediately
    setUser(updatedUser);
    setEvent(updatedEvent);


    toast({
      title: "Success",
      description: toastMessage,
    });
  };

  if (!event) {
     return (
       <div className="container py-12 md:py-16">
         <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
           <div className="md:col-span-2 space-y-8">
             <Skeleton className="relative w-full h-72 md:h-96 rounded-lg" />
             <div className="space-y-4">
               <Skeleton className="h-6 w-24 rounded-md" />
               <Skeleton className="h-12 w-3/4 rounded-md" />
               <Skeleton className="h-20 w-full rounded-md" />
             </div>
           </div>
           <div className="md:col-span-1 space-y-8">
             <Card className="shadow-lg">
               <CardHeader>
                 <CardTitle className="font-headline">Event Details</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <UserIcon className="h-5 w-5 mt-0.5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Speaker</h3>
                      <Skeleton className="h-5 w-32 mt-1 rounded-md" />
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 mt-0.5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Date</h3>
                       <Skeleton className="h-5 w-40 mt-1 rounded-md" />
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 mt-0.5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Time</h3>
                       <Skeleton className="h-5 w-24 mt-1 rounded-md" />
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Tag className="h-5 w-5 mt-0.5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Topic</h3>
                       <Skeleton className="h-5 w-28 mt-1 rounded-md" />
                    </div>
                  </div>
               </CardContent>
             </Card>
           </div>
         </div>
       </div>
     );
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="md:col-span-2 space-y-8">
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
              data-ai-hint={`${event.category} technology`}
            />
          </div>
          <div className="space-y-4">
            <Badge variant="secondary">{event.category}</Badge>
            <h1 className="font-headline text-3xl md:text-5xl font-bold tracking-tight text-primary">
              {event.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {event.description}
            </p>
          </div>
        </div>
        <div className="md:col-span-1 space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <UserIcon className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h3 className="font-semibold">Speaker</h3>
                  <p className="text-muted-foreground">{event.speaker}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h3 className="font-semibold">Date</h3>
                  <p className="text-muted-foreground">{format(event.time, 'EEEE, MMMM d, yyyy')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h3 className="font-semibold">Time</h3>
                  <p className="text-muted-foreground">{format(event.time, 'p')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Tag className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h3 className="font-semibold">Topic</h3>
                  <p className="text-muted-foreground">{event.topic}</p>
                </div>
              </div>
              <Button size="lg" className="w-full mt-4" onClick={handleRegister}>
                {isLoggedIn ? (
                  isRegistered ? (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      You are registered
                    </>
                  ) : (
                     <>
                      <Ticket className="mr-2 h-5 w-5" />
                      Register for this Event
                    </>
                  )
                ) : (
                  <>
                    <Ticket className="mr-2 h-5 w-5" />
                    Login to Register
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          
          <EventAssistant eventContext={event} />

        </div>
      </div>
    </div>
  );
}
