import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import {
  LayoutDashboard, FileText, Image, Video, GraduationCap, Users, ChevronLeft, Menu
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Postagens", href: "/admin/posts", icon: FileText },
  { label: "Galeria", href: "/admin/galeria", icon: Image },
  { label: "Vídeos", href: "/admin/videos", icon: Video },
  { label: "Boletim", href: "/admin/boletim", icon: GraduationCap },
  { label: "Usuários", href: "/admin/usuarios", icon: Users },
];

const AdminLayout = () => {
  const { isAdmin, loading } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  if (!isAdmin) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-muted">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-sidebar text-sidebar-foreground transform transition-transform lg:translate-x-0 lg:static ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2 text-sidebar-foreground">
            <GraduationCap className="h-6 w-6" />
            <span className="font-heading font-bold">Admin</span>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.href
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4">
          <Link to="/" className="text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground flex items-center gap-1">
            <ChevronLeft className="h-3 w-3" /> Voltar ao site
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-card border-b px-4 py-3 flex items-center gap-3 lg:hidden">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-heading font-semibold text-sm">Painel Administrativo</span>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
