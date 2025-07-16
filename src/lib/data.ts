
import { subDays, addDays } from 'date-fns';

export type Event = {
  id: string;
  title: string;
  speaker: string;
  time: Date;
  topic: string;
  description: string;
  registrations: string[]; // array of user IDs
  meetingLink?: string;
  image: string;
  category: 'Webinar' | 'Seminar' | 'Workshop';
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  registeredEvents: string[]; // array of event IDs
};

const staticDate = new Date('2024-07-20T12:00:00Z');

const initialUsers: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'user', registeredEvents: ['1', '3'] },
  { id: '2', name: 'Bob Williams', email: 'bob@example.com', role: 'user', registeredEvents: ['2'] },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'admin', registeredEvents: ['1', '2', '3'] },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', role: 'user', registeredEvents: [] },
];

const initialEvents: Event[] = [
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


const initializeLocalStorage = () => {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem('events')) {
    localStorage.setItem('events', JSON.stringify(initialEvents));
  }
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(initialUsers));
  }
};

initializeLocalStorage();

const readData = <T,>(key: string): T[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(key);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      // Date objects are stringified, so we need to parse them back
      if (key === 'events') {
        return parsed.map((e: Event) => ({ ...e, time: new Date(e.time) }));
      }
      return parsed;
    } catch (e) {
      console.error(`Failed to parse ${key} from localStorage`, e);
      return [];
    }
  }
  return [];
};

const writeData = <T,>(key: string, data: T[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
};

type NewEventData = Omit<Event, 'id' | 'registrations'>;

export function getEvents(): Event[] {
  const events = readData<Event>('events');
  return [...events].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
}

export function getEventById(id: string): Event | undefined {
  return getEvents().find((event) => event.id === id);
}

export function addEvent(eventData: NewEventData): Event {
  const events = getEvents();
  const newEvent: Event = {
    ...eventData,
    id: String(Date.now()),
    registrations: [],
  };
  const updatedEvents = [...events, newEvent];
  writeData('events', updatedEvents);
  return newEvent;
}

export function updateEvent(updatedEvent: Event): void {
  let events = getEvents();
  const index = events.findIndex(event => event.id === updatedEvent.id);
  if (index !== -1) {
    events[index] = updatedEvent;
    writeData('events', events);
  }
}

export function deleteEvent(eventId: string): void {
  let events = getEvents().filter(event => event.id !== eventId);
  writeData('events', events);
  
  let users = getUsers();
  users = users.map(user => ({
    ...user,
    registeredEvents: user.registeredEvents.filter(id => id !== eventId)
  }));
  writeData('users', users);
}

export function getUsers(): User[] {
  return readData<User>('users');
}

export function getUserById(id: string): User | undefined {
  return getUsers().find((user) => user.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export function createUser(userData: { name: string; email: string }): User {
  const users = getUsers();
  const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
  if (existingUser) {
    console.warn('User with this email already exists.');
    return existingUser;
  }

  const newUser: User = {
    id: String(users.length > 0 ? Math.max(...users.map(u => parseInt(u.id))) + 1 : 1),
    name: userData.name,
    email: userData.email,
    role: 'user',
    registeredEvents: [],
  };
  const updatedUsers = [...users, newUser];
  writeData('users', updatedUsers);
  return newUser;
}


export function updateUser(updatedUser: User): void {
  let users = getUsers();
  const index = users.findIndex(user => user.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    writeData('users', users);
  }
}

export function deleteUser(userId: string): void {
  let users = getUsers().filter(user => user.id !== userId);
  writeData('users', users);

  let events = getEvents();
  events = events.map(event => ({
    ...event,
    registrations: event.registrations.filter(id => id !== userId)
  }));
  