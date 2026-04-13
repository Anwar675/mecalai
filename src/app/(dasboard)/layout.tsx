import { SidebarProvider } from "@/components/ui/sidebar";
import { DashBoardSidebar } from "@/modules/dashboard/ui/dashboard-sidebar-view";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <DashBoardSidebar />
      <main className="flex flex-col h-screen w-screen ">
         {children}
      </main>
     
    </SidebarProvider>
  );
};

export default Layout;
