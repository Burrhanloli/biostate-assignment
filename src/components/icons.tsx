import {
  ChevronDown,
  ChevronLeft,
  Dot,
  Ellipsis,
  Layers,
  LayoutDashboardIcon,
  Loader2,
  LucideIcon,
  MenuIcon,
  MoonIcon,
  Rows4,
  ScrollText,
  Search,
  SunIcon,
} from "lucide-react";

export type Icon = LucideIcon;

export const Icons: Record<string, Icon> = {
  dashboard: LayoutDashboardIcon,
  spinner: Loader2,
  moon: MoonIcon,
  sun: SunIcon,
  down: ChevronDown,
  dot: Dot,
  left: ChevronLeft,
  ellipsis: Ellipsis,
  menu: MenuIcon,
  item: Rows4,
  ledger: ScrollText,
  stock: Layers,
  search: Search,
};
