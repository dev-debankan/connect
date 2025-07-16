
'use client'

import { useState } from 'react';
import { getEvents, getUsers, type Event, type User } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoreHorizontal, PlusCircle, Users as UsersIcon, Calendar as CalendarIcon, Trash2, Pencil, LinkIcon, ImageIcon } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDashboardPage() {
  const [events, setEvents] = useState<Event[]>(getEvents());
  const [users, setUsers] = useState<User[]>(getUsers());
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setIsEventFormOpen(true);
  };
  
  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEventFormOpen(true);
  };

  return (
    <div className="container py-12 md:py-16">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage events, users, and registrations.</p>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="events">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="users">
            <UsersIcon className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
        </TabsList>
        <TabsContent value="events" className="mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-headline">Event Management</CardTitle>
                <CardDescription>Create, edit, and track event registrations.</CardDescription>
              </div>
              <Button onClick={handleCreateEvent}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Speaker</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-center">Registrations</TableHead>
                    <TableHead className="text-center">Meeting Link</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>{event.speaker}</TableCell>
                      <TableCell>{format(event.time, 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-center">{event.registrations.length}</TableCell>
                      <TableCell className="text-center">
                        {event.meetingLink ? <Badge>Set</Badge> : <Badge variant="secondary">Not Set</Badge>}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditEvent(event)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                             <DropdownMenuItem>
                              <UsersIcon className="mr-2 h-4 w-4" />
                              View Registrations
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">User Management</CardTitle>
              <CardDescription>View and manage all registered users.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{user.role}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                         <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit role
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete user
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isEventFormOpen} onOpenChange={setIsEventFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{selectedEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
            <DialogDescription>
              {selectedEvent ? 'Update the details for this event.' : 'Fill in the details for the new event.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input id="title" defaultValue={selectedEvent?.title} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="speaker" className="text-right">Speaker</Label>
              <Input id="speaker" defaultValue={selectedEvent?.speaker} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="topic" className="text-right">Topic</Label>
              <Input id="topic" defaultValue={selectedEvent?.topic} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea id="description" defaultValue={selectedEvent?.description} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">
                 <div className="flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" /> Image URL
                </div>
              </Label>
              <Input id="imageUrl" defaultValue={selectedEvent?.image} className="col-span-3" placeholder="https://placehold.co/600x400.png" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="meetingLink" className="text-right">
                <div className="flex items-center gap-1">
                  <LinkIcon className="h-3 w-3" /> Meeting Link
                </div>
              </Label>
              <Input id="meetingLink" defaultValue={selectedEvent?.meetingLink} className="col-span-3" placeholder="https://meet.google.com/..." />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

    