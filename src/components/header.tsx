
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Menu, Users } from 'lucide-react';
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
        
        const linkComponent = (
           <Link
            key={link.href}
            href={link.href}
            className={cn(
              'transition-colors hover:text-primary',
              isActive ? 'text-primary font-semibold' : 'text-muted-foreground',
              isMobile ? 'text-lg font-medium py-2 block' : 'text-sm font-medium'
            )}
          >
            {link.label}
          </Link>
        );

        return isMobile ? <SheetClose asChild key={`${link.href}-mobile`}>{linkComponent}</SheetClose> : linkComponent;
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

        <div className="flex-1 flex items-center md:hidden">
           <Link href="/" className="mr-6 flex items-center space-x-2">
            <Users className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block font-headline">GDG Connect</span>
          </Link>
        </div>


        <div className="flex items-center justify-end space-x-2 flex-1 md:flex-none">
          {isLoggedIn ? (
            <Button onClick={handleLogout} variant="secondary">
              Logout
            </Button>
          ) : (
            <>
              <div className="hidden sm:flex">
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            </>
          )}

          {/* DEV ONLY: Mock auth controls */}
          {!isLoggedIn && process.env.NODE_ENV === 'development' && (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => handleLogin()}>
                <span className="hidden md:inline">Login as User</span>
                <span className="md:hidden">User</span>
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleLogin(true)}>
                 <span className="hidden md:inline">Login as Admin</span>
                 <span className="md:hidden">Admin</span>
              </Button>
            </div>
          )}

           <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <SheetHeader className="sr-only">
                  <SheetTitle>Mobile Navigation Menu</SheetTitle>
                  <SheetDescription>
                    A list of navigation links for the GDG Connect Streamline application.
                  </SheetDescription>
                </SheetHeader>
                <Link href="/" className="mr-6 flex items-center space-x-2 mb-6">
                  <Users className="h-6 w-6 text-primary" />
                  <span className="font-bold font-headline">GDG Connect</span>
                </Link>
                <div className="mt-6 flex flex-col space-y-2">
                  {renderNavLinks(true)}
                </div>
                 {!isLoggedIn && (
                  <div className="mt-6 pt-6 border-t space-y-2">
                     <SheetClose asChild>
                      <Link href="/login" className="block w-full">
                        <Button variant="outline" className="w-full">Login</Button>
                      </Link>
                    </SheetClose>
                     <SheetClose asChild>
                      <Link href="/signup" className="block w-full">
                        <Button className="w-full">Sign Up</Button>
                      </Link>
                    </SheetClose>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
