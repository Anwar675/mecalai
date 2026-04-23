import { SidebarProvider } from "@/components/ui/sidebar";
import { DashbarNavbar } from "@/modules/dashboard/ui/dashboard-navabr";
import { DashBoardSidebar } from "@/modules/dashboard/ui/dashboard-sidebar-view";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <DashBoardSidebar />
      <main className="flex flex-col bg-[#D8E3EB] h-full w-full ">
        <DashbarNavbar />
        {children}
      </main>
     
    </SidebarProvider>
  );
};

export default Layout;
