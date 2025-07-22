'use client'

import { useState, useEffect, useRef } from 'react';
import { addEvent, getEvents, getUsers, type Event, type User, deleteEvent, deleteUser, updateUser, updateEvent as updateEventData } from '@/lib/data';
import { generateEventImage } from '@/ai/flows/generate-event-image';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoreHorizontal, PlusCircle, Users as UsersIcon, Calendar as CalendarIcon, Trash2, Pencil, LinkIcon, ImageIcon, ClockIcon, Sparkles, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

type DialogContext = 'eventDelete' | 'userDelete' | 'none';

export default function AdminDashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventToView, setEventToView] = useState<Event | null>(null);
  const [isRegistrationsOpen, setIsRegistrationsOpen] = useState(false);
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  
  const [dialogContext, setDialogContext] = useState<DialogContext>('none');
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  const [isUserRoleDialogOpen, setIsUserRoleDialogOpen] = useState(false);
  const [selectedUserForRoleChange, setSelectedUserForRoleChange] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<'user' | 'admin'>('user');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const eventFormRef = useRef<HTMLFormElement>(null);

  const { toast } = useToast();

  useEffect(() => {
    refreshData();
  }, []);
  
  useEffect(() => {
    if (isEventFormOpen && selectedEvent) {
      setEventDate(new Date(selectedEvent.time));
    } else if (isEventFormOpen && !selectedEvent) {
      setEventDate(new Date());
    } else {
      setEventDate(undefined);
    }
  }, [isEventFormOpen, selectedEvent]);

  const refreshData = () => {
    setEvents(getEvents());
    setUsers(getUsers());
  };

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
      refreshData();
      setEventToDelete(null);
      setDialogContext('none');
      toast({ title: "Success", description: "Event deleted successfully." });
    }
  };

  const handleUserDeleteClick = (user: User) => {
    setDialogContext('userDelete');
    setUserToDelete(user);
  };

  const handleConfirmUserDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
      refreshData();
      setUserToDelete(null);
      setDialogContext('none');
      toast({ title: "Success", description: "User deleted successfully." });
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
      refreshData();
      setIsUserRoleDialogOpen(false);
      setSelectedUserForRoleChange(null);
      toast({ title: "Success", description: "User role updated." });
    }
  };
  
  const handleEventSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const timeValue = formData.get('time') as string;
    const [hours, minutes] = timeValue.split(':').map(Number);
    const combinedDate = new Date(eventDate || new Date());
    combinedDate.setHours(hours, minutes, 0, 0);

    const eventData = {
      title: formData.get('title') as string,
      speaker: formData.get('speaker') as string,
      topic: formData.get('topic') as string,
      description: formData.get('description') as string,
      image: formData.get('imageUrl') as string || 'https://placehold.co/600x400.png',
      meetingLink: formData.get('meetingLink') as string,
      category: 'Webinar' as const, 
      time: combinedDate,
    };

    if (selectedEvent) {
      const updatedEvent = {
        ...selectedEvent,
        ...eventData
      };
      updateEventData(updatedEvent);
      toast({ title: "Success", description: "Event updated successfully." });
    } else {
      addEvent(eventData);
      toast({ title: "Success", description: "Event created successfully." });
    }

    refreshData();
    setIsEventFormOpen(false);
    setSelectedEvent(null);
  };


  const getRegisteredUsers = (event: Event | null): User[] => {
    if (!event) return [];
    return getUsers().filter(user => event.registrations.includes(user.id));
  };
  
  const handleGenerateImage = async () => {
    if (!eventFormRef.current) return;
    const formData = new FormData(eventFormRef.current);
    const title = formData.get('title') as string;
    const topic = formData.get('topic') as string;

    const prompt = title || topic;
    if (!prompt) {
      toast({
        title: "Cannot Generate Image",
        description: "Please enter a title or topic for the event first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGeneratingImage(true);
    try {
      const result = await generateEventImage({ prompt: `tech event banner for ${prompt}` });
      const imageUrlInput = eventFormRef.current.elements.namedItem('imageUrl') as HTMLInputElement;
      if (imageUrlInput) {
        imageUrlInput.value = result.imageDataUri;
      }
      toast({
        title: "Image Generated",
        description: "The event image has been successfully generated and added.",
      });
    } catch (error) {
      console.error("Image generation failed:", error);
      toast({
        title: "Image Generation Failed",
        description: "There was an error generating the image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingImage(false);
    }
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
                <div className="space-y-2">
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
                          <TableCell className="whitespace-nowrap">{format(new Date(event.time), 'MMM d, yyyy')}</TableCell>
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
            <DialogContent className="sm:max-w-[600px] grid-rows-[auto_minmax(0,1fr)_auto] max-h-[90svh] flex flex-col">
              <DialogHeader className="flex-shrink-0">
                <DialogTitle className="font-headline">{selectedEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
                <DialogDescription>
                  {selectedEvent ? 'Update the details for this event.' : 'Fill in the details for the new event.'}
                </DialogDescription>
              </DialogHeader>
              <form ref={eventFormRef} onSubmit={handleEventSubmit} className="flex-grow overflow-hidden flex flex-col">
                <div className="grid gap-6 py-4 overflow-y-auto pr-6 flex-grow">
                  <div className="grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-2 md:gap-4">
                    <Label htmlFor="title" className="md:text-right">Title</Label>
                    <Input id="title" name="title" defaultValue={selectedEvent?.title} className="md:col-span-3" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-2 md:gap-4">
                    <Label htmlFor="speaker" className="md:text-right">Speaker</Label>
                    <Input id="speaker" name="speaker" defaultValue={selectedEvent?.speaker} className="md:col-span-3" />
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-2 md:gap-4">
                    <Label className="md:text-right">Date & Time</Label>
                    <div className="md:col-span-3 grid grid-cols-2 gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "justify-start text-left font-normal",
                                !eventDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {eventDate ? format(eventDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={eventDate}
                              onSelect={setEventDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <Input
                          id="time"
                          name="time"
                          type="time"
                          defaultValue={eventDate ? format(new Date(eventDate), 'HH:mm') : ''}
                        />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-2 md:gap-4">
                    <Label htmlFor="topic" className="md:text-right">Topic</Label>
                    <Input id="topic" name="topic" defaultValue={selectedEvent?.topic} className="md:col-span-3" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-2 md:gap-4">
                    <Label htmlFor="description" className="md:text-right">Description</Label>
                    <Textarea id="description" name="description" defaultValue={selectedEvent?.description} className="md:col-span-3" />
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-2 md:gap-4">
                    <Label htmlFor="imageUrl" className="md:text-right pt-2">
                       <div className="flex items-center gap-1">
                        <ImageIcon className="h-3 w-3" /> Image URL
                      </div>
                    </Label>
                    <div className="md:col-span-3 space-y-2">
                      <Input id="imageUrl" name="imageUrl" defaultValue={selectedEvent?.image} placeholder="Paste URL or generate one" />
                       <Button type="button" variant="secondary" onClick={handleGenerateImage} disabled={isGeneratingImage}>
                        {isGeneratingImage ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="mr-2 h-4 w-4" />
                        )}
                        Generate Image
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-2 md:gap-4">
                    <Label htmlFor="meetingLink" className="md:text-right">
                      <div className="flex items-center gap-1">
                        <LinkIcon className="h-3 w-3" /> Meeting Link
                      </div>
                    </Label>
                    <Input id="meetingLink" name="meetingLink" defaultValue={selectedEvent?.meetingLink} className="md:col-span-3" placeholder="https://meet.google.com/..." />
                  </div>
                </div>
                <DialogFooter className="flex-shrink-0">
                  <Button type="button" variant="outline" onClick={() => setIsEventFormOpen(false)}>Cancel</Button>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
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
