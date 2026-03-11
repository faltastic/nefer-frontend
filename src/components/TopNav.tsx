import Link from 'next/link';
import { getUser } from '@/lib/supabase/server-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MagnifyingGlass, UserCircle } from '@phosphor-icons/react/dist/ssr';

export async function TopNav() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold inline-block text-xl tracking-tight">Nefer</span>
          </Link>
          <div className="hidden md:flex relative w-full max-w-sm items-center">
            <MagnifyingGlass className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search creators..."
              className="pl-9 rounded-full bg-muted/50 border-none h-9 focus-visible:ring-1"
            />
          </div>
          <div className="hidden md:flex">
             <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
               About
             </Link>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/account">
                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                  <UserCircle className="h-6 w-6" />
                </Button>
              </Link>
            </div>
          ) : (
            <Link href="/join">
              <Button variant="default" className="rounded-full h-9 px-4">Login / Join</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
