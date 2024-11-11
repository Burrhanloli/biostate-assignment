import AppLogo from "./app-logo";
import ThemeToggle from "./theme-toggle";
import { SidebarTrigger } from "./ui/sidebar";

export default function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-card pr-4 shadow-lg transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <AppLogo />
        <h1 className="text-2xl">Biostate Assignment</h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
