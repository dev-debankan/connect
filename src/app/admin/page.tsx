
'use client'

import { useState } from 'react';
import { getEvents, getUsers, type Event, type User, deleteEvent, deleteUser, updateUser } from '@/lib/data';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoreHorizontal, PlusCircle, Users as UsersIcon, Calendar as CalendarIcon, Trash2, Pencil, LinkIcon, ImageIcon } from 'lucide-react';
import { format } from 'date-fns';

type DialogContext = 'eventDelete' | 'userDelete' | 'none';

export default function AdminDashboardPage() {
  const [events, setEvents] = useState<Event[]>(getEvents());
  const [users, setUsers] = useState<User[]>(getUsers());
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventToView, setEventToView] = useState<Event | null>(null);
  const [isRegistrationsOpen, setIsRegistrationsOpen] = useState(false);
  
  const [dialogContext, setDialogContext] = useState<DialogContext>('none');
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  const [isUserRoleDialogOpen, setIsUserRoleDialogOpen] = useState(false);
  const [selectedUserForRoleChange, setSelectedUserForRoleChange] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<'user' | 'admin'>('user');


  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setIsEventFormOpen(true);
  };
  
  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEventFormOpen(true);
  };

  const handleViewRegistrations = (event: Event) => {
    setEventToView(event);
    setIsRegistrationsOpen(true);
  };

  const handleEventDeleteClick = (event: Event) => {
    setDialogContext('eventDelete');
    setEventToDelete(event);
  };
  
  const handleConfirmEventDelete = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete.id);
      setEvents(getEvents());
      setEventToDelete(null);
      setDialogContext('none');
    }
  };

  const handleUserDeleteClick = (user: User) => {
    setDialogContext('userDelete');
    setUserToDelete(user);
  };

  const handleConfirmUserDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
      setUsers(getUsers());
      setEvents(getEvents()); // Refresh events in case registrations changed
      setUserToDelete(null);
      setDialogContext('none');
    }
  };

  const handleEditRoleClick = (user: User) => {
    setSelectedUserForRoleChange(user);
    setNewRole(user.role);
    setIsUserRoleDialogOpen(true);
  };

  const handleRoleChange = (value: 'user' | 'admin') => {
    setNewRole(value);
  };

  const handleSaveRole = () => {
    if (selectedUserForRoleChange) {
      const updatedUser = { ...selectedUserForRoleChange, role: newRole };
      updateUser(updatedUser);
      setUsers(getUsers());
      setIsUserRoleDialogOpen(false);
      setSelectedUserForRoleChange(null);
    }
  };

  const getRegisteredUsers = (event: Event | null): User[] => {
    if (!event) return [];
    return getUsers().filter(user => event.registrations.includes(user.id));
  };


  return (
    <AlertDialog>
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
              <CardHeader className="flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="font-headline">Event Management</CardTitle>
                  <CardDescription>Create, edit, and track event registrations.</CardDescription>
                </div>
                <Button onClick={handleCreateEvent} className="w-full md:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Event
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
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
                          <TableCell className="font-medium whitespace-nowrap">{event.title}</TableCell>
                          <TableCell className="whitespace-nowrap">{event.speaker}</TableCell>
                          <TableCell className="whitespace-nowrap">{format(event.time, 'MMM d, yyyy')}</TableCell>
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
                                 <DropdownMenuItem onClick={() => handleViewRegistrations(event)}>
                                  <UsersIcon className="mr-2 h-4 w-4" />
                                  View Registrations
                                </DropdownMenuItem>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={() => handleEventDeleteClick(event)} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
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
                <div className="overflow-x-auto">
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
                        <TableCell className="font-medium whitespace-nowrap">{user.name}</TableCell>
                        <TableCell className="whitespace-nowrap">{user.email}</TableCell>
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
                              <DropdownMenuItem onClick={() => handleEditRoleClick(user)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit role
                              </DropdownMenuItem>
                               <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={() => handleUserDeleteClick(user)} className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete user
                                </DropdownMenuItem>
                               </AlertDialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {dialogContext === 'eventDelete' && (
          <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the event
                  <span className="font-semibold"> {eventToDelete?.title}</span> and remove all registration data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDialogContext('none')}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmEventDelete}>Continue</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
        )}

        {dialogContext === 'userDelete' && (
           <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the user
                  <span className="font-semibold"> {userToDelete?.name}</span> and remove them from all events.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDialogContext('none')}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmUserDelete}>Continue</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
        )}

        <Dialog open={isRegistrationsOpen} onOpenChange={setIsRegistrationsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-headline">Registrations for {eventToView?.title}</DialogTitle>
              <DialogDescription>
                A list of all users registered for this event.
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto max-h-80 mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getRegisteredUsers(eventToView).length > 0 ? (
                    getRegisteredUsers(eventToView).map(user => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-muted-foreground">
                        No users have registered yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <DialogFooter className="mt-4">
               <Button variant="outline" onClick={() => setIsRegistrationsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


        <Dialog open={isEventFormOpen} onOpenChange={setIsEventFormOpen}>
          <DialogContent className="sm:max-w-[600px] grid-rows-[auto_minmax(0,1fr)_auto] max-h-[90svh]">
            <DialogHeader>
              <DialogTitle className="font-headline">{selectedEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
              <DialogDescription>
                {selectedEvent ? 'Update the details for this event.' : 'Fill in the details for the new event.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4 overflow-y-auto pr-6">
              <div className="grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-2 md:gap-4">
                <Label htmlFor="title" className="md:text-right">Title</Label>
                <Input id="title" defaultValue={selectedEvent?.title} className="md:col-span-3" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-2 md:gap-4">
                <Label htmlFor="speaker" className="md:text-right">Speaker</Label>
                <Input id="speaker" defaultValue={selectedEvent?.speaker} className="md:col-span-3" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-2 md:gap-4">
                <Label htmlFor="topic" className="md:text-right">Topic</Label>
                <Input id="topic" defaultValue={selectedEvent?.topic} className="md:col-span-3" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-2 md:gap-4">
                <Label htmlFor="description" className="md:text-right">Description</Label>
                <Textarea id="description" defaultValue={selectedEvent?.description} className="md:col-span-3" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-2 md:gap-4">
                <Label htmlFor="imageUrl" className="md:text-right">
                   <div className="flex items-center gap-1">
                    <ImageIcon className="h-3 w-3" /> Image URL
                  </div>
                </Label>
                <Input id="imageUrl" defaultValue={selectedEvent?.image} className="md:col-span-3" placeholder="https://placehold.co/600x400.png" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-2 md:gap-4">
                <Label htmlFor="meetingLink" className="md:text-right">
                  <div className="flex items-center gap-1">
                    <LinkIcon className="h-3 w-3" /> Meeting Link
                  </div>
                </Label>
                <Input id="meetingLink" defaultValue={selectedEvent?.meetingLink} className="md:col-span-3" placeholder="https://meet.google.com/..." />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isUserRoleDialogOpen} onOpenChange={setIsUserRoleDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-headline">Edit User Role</DialogTitle>
              <DialogDescription>
                Change the role for <span className="font-semibold">{selectedUserForRoleChange?.name}</span>.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role-select" className="text-right">
                  Role
                </Label>
                <Select value={newRole} onValueChange={handleRoleChange}>
                  <SelectTrigger id="role-select" className="col-span-3">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUserRoleDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveRole}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </AlertDialog>
  );
}

    