import Sidebar from "@/components/Sidebar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div id="sidebar-container">
        <Sidebar />
      </div>
      <div className="main">{children}</div>
      <div className="bottom">© 2019 - {new Date().getFullYear()} Swasti Mishra </div>
    </>
  );
}
