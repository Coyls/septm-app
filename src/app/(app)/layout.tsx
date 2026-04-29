import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar className="hidden md:flex" />
      <div className="flex flex-col flex-1 min-w-0">
        <MobileHeader className="md:hidden" />
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
