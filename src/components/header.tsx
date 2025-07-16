'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Users, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    // In a real app, you'd check a token or session here
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsLoggedIn(loggedInStatus);
    setIsAdmin(adminStatus);
  }, []);

  const handleLogin = (admin = false) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('isAdmin', String(admin));
    setIsLoggedIn(true);
    setIsAdmin(admin);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/events', label: 'Events' },
    { href: '/dashboard', label: 'Dashboard', loggedIn: true },
    { href: '/admin', label: 'Admin', admin: true },
  ];

  const renderNavLinks = (isMobile = false) => (
    <>
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        if ((link.loggedIn && !isLoggedIn) || (link.admin && !isAdmin)) {
          return null;
        }
        return (
          <Link key={link.href} href={link.href} legacyBehavior passHref>
            <a
              className={cn(
                'transition-colors hover:text-primary',
                isActive ? 'text-primary font-semibold' : 'text-muted-foreground',
                isMobile ? 'text-lg font-medium' : 'text-sm font-medium'
              )}
            >
              {link.label}
            </a>
          </Link>
        );
      })}
    </>
  );

  if (!isMounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="h-6 w-24 rounded-md bg-muted animate-pulse" />
          <div className="h-8 w-20 rounded-md bg-muted animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Users className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">GDG Connect</span>
          </Link>
          <nav className="flex items-center space-x-6">{renderNavLinks()}</nav>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <Link href="/" className="mr-6 flex items-center space-x-2">
                <Users className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline">GDG Connect</span>
              </Link>
              <div className="mt-6 flex flex-col space-y-4">{renderNavLinks(true)}</div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {isLoggedIn ? (
            <Button onClick={handleLogout} variant="secondary">
              Logout
            </Button>
          ) : (
            <>
              <Link href="/login" passHref legacyBehavior>
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup" passHref legacyBehavior>
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
        {/* DEV ONLY: Mock auth controls */}
        {!isLoggedIn && process.env.NODE_ENV === 'development' && (
          <div className="pl-4">
            <Button size="sm" variant="outline" onClick={() => handleLogin()}>
              Login as User
            </Button>
            <Button size="sm" variant="outline" className="ml-2" onClick={() => handleLogin(true)}>
              Login as Admin
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
