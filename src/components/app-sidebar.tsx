import {
  Calendar,
  Home,
  Inbox,
  Settings,
  Activity,
  Moon,
  Sun,
  Hammer,
} from "lucide-react";

import { useTheme } from "next-themes";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { NavUser } from "@/components/nav-user";

// Menu items.
const data = {
  projects: [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: Calendar,
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Activity,
    },
    {
      title: "Tools",
      url: "/tools",
      icon: Hammer,
    },
    {
      title: "About",
      url: "/about",
      icon: Inbox,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
  user: {
    name: "SherlockOuO",
    email: "wdf.coder@gmail.com",
    avatar:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
};

export function AppSidebar() {
  const { theme, setTheme } = useTheme();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.projects.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col">
          <div>
            {theme === "light" ? (
              <Sun onClick={() => setTheme("dark")} />
            ) : (
              <Moon onClick={() => setTheme("light")} />
            )}
          </div>
          <div>
            <NavUser user={data.user} />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
