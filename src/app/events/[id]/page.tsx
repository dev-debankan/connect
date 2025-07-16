import { getEventById, type Event } from '@/lib/data';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Tag, Ticket } from 'lucide-react';
import EventAssistant from '@/components/event-assistant';

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const event = getEventById(params.id);

  if (!event) {
    notFound();
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="md:col-span-2 space-y-8">
          <div className="relative w-full h-72 md:h-96 rounded-lg overflow-hidden shadow-lg">
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
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-primary">
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
                <User className="h-5 w-5 mt-0.5 text-primary" />
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
              <Button size="lg" className="w-full mt-4">
                <Ticket className="mr-2 h-5 w-5" />
                Register for this Event
              </Button>
            </CardContent>
          </Card>
          
          <EventAssistant />

        </div>
      </div>
    </div>
  );
}
