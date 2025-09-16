import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="sm:hidden" />
      <div className="flex-1" />
      <Avatar>
        <AvatarImage src="https://picsum.photos/seed/user/40/40" alt="User" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </header>
  );
}
