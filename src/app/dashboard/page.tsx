
'use client';

import { useEffect, useState } from 'react';
import { EventCard } from "@/components/event-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserById, getEventById, type User, type Event as EventType } from "@/lib/data";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<EventType[]>([]);
  const router = useRouter();

  useEffect(() => {
    // This effect now runs on every navigation to the dashboard to get fresh data
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      const { id } = JSON.parse(storedUser);
      const userData = getUserById(id);
      if (userData) {
        setUser(userData);
        const events = userData.registeredEvents
          .map(eventId => getEventById(eventId))
          .filter(Boolean) as EventType[];
        setRegisteredEvents(events);
      } else {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  if (!user) {
    return (
        <div className="container py-12 md:py-16 text-center">
            <p>Loading your dashboard...</p>
        </div>
    );
  }

  const now = new Date();
  const upcomingRegisteredEvents = registeredEvents.filter(event => new Date(event.time) >= now);
  const pastRegisteredEvents = registeredEvents.filter(event => new Date(event.time) < now);

  return (
    <div className="container py-12 md:py-16">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Welcome, {user.name}!</h1>
        <p className="text-muted-foreground mt-2">Here's your personal dashboard.</p>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="events">My Events</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="events" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">My Registered Events</CardTitle>
              <CardDescription>A list of events you've registered for.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Upcoming</h3>
                {upcomingRegisteredEvents.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {upcomingRegisteredEvents.map(event => <EventCard key={event.id} event={event} />)}
                  </div>
                ) : (
                  <p className="text-muted-foreground">You have no upcoming registered events.</p>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Past</h3>
                {pastRegisteredEvents.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {pastRegisteredEvents.map(event => <EventCard key={event.id} event={event} />)}
                  </div>
                ) : (
                  <p className="text-muted-foreground">You have no past registered events.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="profile" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Profile Information</CardTitle>
              <CardDescription>Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={user.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user.email} />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
