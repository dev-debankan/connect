import { subDays, addDays } from 'date-fns';

export type Event = {
  id: string;
  title: string;
  speaker: string;
  time: Date;
  topic: string;
  description: string;
  registrations: string[];
  meetingLink?: string;
  image: string;
  category: 'Webinar' | 'Seminar' | 'Workshop';
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  registeredEvents: string[];
};

// Static date reference to ensure consistency across server and client renders
const staticDate = new Date('2024-07-20T12:00:00Z');

let users: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'user', registeredEvents: ['1', '3'] },
  { id: '2', name: 'Bob Williams', email: 'bob@example.com', role: 'user', registeredEvents: ['2'] },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'admin', registeredEvents: ['1', '2', '3'] },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', role: 'user', registeredEvents: [] },
];

let events: Event[] = [
  {
    id: '1',
    title: 'Next.js 15 Deep Dive',
    speaker: 'Jane Doe',
    time: addDays(staticDate, 7),
    topic: 'Web Development',
    description: 'Explore the new features of Next.js 15, including React 19 support, new APIs, and performance improvements. This session is for intermediate to advanced developers.',
    registrations: ['1', '3'],
    meetingLink: 'https://meet.google.com/xyz-abc-def',
    image: 'https://placehold.co/600x400/3B82F6/FFFFFF',
    category: 'Webinar',
  },
  {
    id: '2',
    title: 'AI with Gemini and Genkit',
    speaker: 'John Smith',
    time: addDays(staticDate, 14),
    topic: 'Artificial Intelligence',
    description: 'A comprehensive workshop on building generative AI applications using Google\'s Gemini models and the Genkit framework. Perfect for developers looking to get into AI.',
    registrations: ['2', '3'],
    image: 'https://placehold.co/600x400/10B981/FFFFFF',
    category: 'Workshop',
  },
  {
    id: '3',
    title: 'Mastering Firebase for Modern Apps',
    speaker: 'Emily White',
    time: addDays(staticDate, 21),
    topic: 'Cloud & Firebase',
    description: 'Learn how to leverage Firebase to build scalable, secure, and real-time applications. We will cover Firestore, Authentication, and Cloud Functions.',
    registrations: ['1', '3'],
    image: 'https://placehold.co/600x400/F59E0B/FFFFFF',
    category: 'Seminar',
  },
  {
    id: '4',
    title: 'UI/UX Design Principles',
    speaker: 'Michael Green',
    time: subDays(staticDate, 5),
    topic: 'Design',
    description: 'A look back at our popular session on fundamental UI/UX design principles that lead to great user experiences. This is a recording of the live event.',
    registrations: [],
    meetingLink: 'https://youtube.com/watch?v=xyz',
    image: 'https://placehold.co/600x400/8B5CF6/FFFFFF',
    category: 'Webinar',
  },
   {
    id: '5',
    title: 'Advanced State Management in React',
    speaker: 'Sarah Lee',
    time: addDays(staticDate, 30),
    topic: 'Web Development',
    description: 'Tired of prop drilling? This webinar explores advanced state management techniques in React using libraries like Zustand, Jotai, and the Context API.',
    registrations: [],
    image: 'https://placehold.co/600x400/61DAFB/000000',
    category: 'Webinar',
  },
   {
    id: '6',
    title: 'Introduction to Go for Beginners',
    speaker: 'Chris Rodriguez',
    time: addDays(staticDate, 45),
    topic: 'Backend Development',
    description: 'Get started with the Go programming language. This workshop covers syntax, concurrency, and building a simple web server.',
    registrations: [],
    image: 'https://placehold.co/600x400/00ADD8/FFFFFF',
    category: 'Workshop',
  },
];

export function getEvents(): Event[] {
  return [...events].sort((a, b) => a.time.getTime() - b.time.getTime());
}

export function getEventById(id: string): Event | undefined {
  return events.find((event) => event.id === id);
}

export function updateEvent(updatedEvent: Event): void {
  const index = events.findIndex(event => event.id === updatedEvent.id);
  if (index !== -1) {
    events[index] = updatedEvent;
  }
}

export function deleteEvent(eventId: string): void {
  events = events.filter(event => event.id !== eventId);
  // Also remove this event from any user's registeredEvents list
  users = users.map(user => ({
    ...user,
    registeredEvents: user.registeredEvents.filter(id => id !== eventId)
  }));
}

export function getUsers(): User[] {
  return [...users];
}

export function getUserById(id: string): User | undefined {
  return users.find((user) => user.id === id);
}

export function updateUser(updatedUser: User): void {
  const index = users.findIndex(user => user.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
  }
}

export function deleteUser(userId: string): void {
  users = users.filter(user => user.id !== userId);
  // Also remove this user from any event's registrations list
  events = events.map(event => ({
    ...event,
    registrations: event.registrations.filter(id => id !== userId)
  }));
}
