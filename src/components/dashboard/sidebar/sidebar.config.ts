import {
  LayoutDashboard,
  FileText,
  Settings,
  Inbox,
  BarChart3,
} from "lucide-react";

export type SidebarItemType = {
  name: string;
  href: string;
  icon: React.ElementType;
};

export type SidebarGroupType = {
  label: string;
  items: SidebarItemType[];
};

export const SIDEBAR_CONFIG: SidebarGroupType[] = [
  {
    label: "Workspace",
    items: [
      { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { name: "My Forms", href: "/dashboard/forms", icon: FileText },
    ],
  },

  // Nanti kalau lu udah bikin halaman rekap global buat submission & analytics
  // (misal di src/app/(app)/dashboard/analytics/page.tsx),
  // lu tinggal uncomment block di bawah ini:

  /*
  {
    label: "Insights",
    items: [
      { name: "Submissions", href: "/dashboard/submissions", icon: Inbox },
      { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    ],
  },
  */

  {
    label: "System",
    items: [
      // Catatan: Di folder tree lu belum ada src/app/(app)/dashboard/settings/page.tsx.
      // Jangan lupa dibikin ya foldernya biar kalau di-klik nggak 404 Not Found.
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];
