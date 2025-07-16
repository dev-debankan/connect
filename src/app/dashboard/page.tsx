
import { EventCard } from "@/components/event-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserById, getEventById } from "@/lib/data";
import { notFound } from "next/navigation";

export default function DashboardPage() {
  // In a real app, you would get the logged-in user's ID from the session.
  const user = getUserById('1');

  if (!user) {
    // This would redirect to login in a real app
    notFound();
  }

  const registeredEvents = user.registeredEvents.map(eventId => getEventById(eventId)).filter(Boolean);
  const now = new Date();
  const upcomingRegisteredEvents = registeredEvents.filter(event => event!.time >= now);
  const pastRegisteredEvents = registeredEvents.filter(event => event!.time < now);

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
                    {upcomingRegisteredEvents.map(event => event && <EventCard key={event.id} event={event} />)}
                  </div>
                ) : (
                  <p className="text-muted-foreground">You have no upcoming registered events.</p>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Past</h3>
                {pastRegisteredEvents.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {pastRegisteredEvents.map(event => event && <EventCard key={event.id} event={event} />)}
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
