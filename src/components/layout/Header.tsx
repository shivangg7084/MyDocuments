import { Menu } from "lucide-react";
import { SearchBar } from "@/components/common/SearchBar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 lg:px-6">
      <button
        type="button"
        aria-label="Open menu"
        onClick={onMenuClick}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="max-w-xl flex-1">
        <SearchBar />
      </div>
      <ThemeToggle />
    </header>
  );
}
