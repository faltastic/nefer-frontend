import Link from 'next/link';
import { getUser } from '@/lib/supabase/server-auth';
import { Button } from '@/components/ui/button';
import { UserCircle } from "@phosphor-icons/react/dist/ssr";
import { SearchBar } from "@/components/SearchBar";

export async function TopNav() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold inline-block text-xl bg-gradient-to-r from-emerald-400 to-fuchsia-400 bg-clip-text text-transparent">
              Nefer
            </span>
          </Link>
          <SearchBar className="hidden md:flex" />
        </div>

        <nav className="flex items-center gap-4">
          {/* <div className="flex"> */}
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
          {/* </div> */}
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/account">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-9 w-9"
                >
                  <UserCircle className="h-6 w-6" />
                </Button>
              </Link>
            </div>
          ) : (
            <Link href="/join">
              <Button variant="default" className="rounded-full h-9 px-4">
                Login / Join
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
