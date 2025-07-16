
import Link from "next/link";
import { Users, Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Users className="h-6 w-6 text-primary" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by GDG Connect Streamline. &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#" target="_blank" rel="noreferrer" className="rounded-lg p-2 transition-colors hover:bg-secondary">
              <Twitter className="h-5 w-5 text-muted-foreground" />
              <span className="sr-only">Twitter</span>
          </Link>
          <Link href="#" target="_blank" rel="noreferrer" className="rounded-lg p-2 transition-colors hover:bg-secondary">
              <Github className="h-5 w-5 text-muted-foreground" />
              <span className="sr-only">Github</span>
          </Link>
          <Link href="#" target="_blank" rel="noreferrer" className="rounded-lg p-2 transition-colors hover:bg-secondary">
              <Linkedin className="h-5 w-5 text-muted-foreground" />
              <span className="sr-only">LinkedIn</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
