import {
  Calendar,
  Home,
  Inbox,
  Settings,
  Activity,
  Moon,
  Sun,
  Hammer,
  Binary,
  ChevronRight,
  Terminal,
  ListTodo,
  BookOpenCheck,
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { NavUser } from "@/components/nav-user";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

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
      title: "About",
      url: "/about",
      icon: Inbox,
    },
  ],
  context: [
    {
      title: "Context",
      url: "#",
      icon: Binary,
      isActive: true,
      items: [
        {
          title: "Code Context",
          url: "/ctx/code",
          icon: Terminal,
          isActive: true,
        },
        {
          title: "Todo",
          url: "/ctx/todo",
          icon: ListTodo,
          isActive: true,
        },
        {
          title: "ReadWise",
          url: "/ctx/readwise",
          icon: BookOpenCheck,
          isActive: true,
        },
      ],
    },
  ],
  tools: [
    {
      title: "Tools",
      url: "/tools",
      icon: Hammer,
      isActive: true,
      items: [
        {
          title: "SoftLink",
          url: "/tools/symlink",
          icon: Settings,
          isActive: true,
        },
        {
          title: "TimeStamp",
          url: "/tools/time",
          icon: Settings,
          isActive: true,
        },
      ],
    },
  ],
  user: {
    name: "SherlockOuO",
    email: "wdf.coder@gmail.com",
    avatar:
      "https://images.unsplash.com/photo-1731331121037-0c9b31455ddd?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
};

export function AppSidebar() {
  const { theme, setTheme } = useTheme();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Swfaw</SidebarGroupLabel>
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
            <SidebarMenu>
              {data.context.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link to={subItem.url}>
                                {subItem.icon && <subItem.icon />}
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
            <SidebarMenu>
              {data.tools.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link to={subItem.url}>
                                {subItem.icon && <subItem.icon />}
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
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
