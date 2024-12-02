import { useRoutes } from "react-router-dom";
import routes from "@/route";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { cn } from "@/lib/utils";

export default function Layout() {
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row w-full flex-1 max-w-full mx-auto ",
        "h-[100vh]", // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          <Main />
        </main>
      </SidebarProvider>
    </div>
  );
}

const Main = () => {
  const page = useRoutes(routes);

  return (
    <div className="flex flex-col flex-1">
      <div className="m-2">{page}</div>
    </div>
  );
};
