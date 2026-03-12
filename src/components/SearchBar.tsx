import { Input } from "@/components/ui/input";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  variant?: "desktop" | "mobile";
  className?: string;
}

export function SearchBar({ variant = "desktop", className }: SearchBarProps) {
  if (variant === "mobile") {
    return (
      <div className={cn("relative w-full", className)}>
        <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search creators..."
          className="pl-12 rounded-full bg-muted/50 border-none h-14 focus-visible:ring-1 w-full text-base shadow-sm"
        />
      </div>
    );
  }

  return (
    <div className={cn("relative w-full max-w-sm flex items-center", className)}>
      <MagnifyingGlass className="absolute left-3 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search creators..."
        className="pl-9 rounded-full bg-muted/50 border-none h-9 focus-visible:ring-1"
      />
    </div>
  );
}
