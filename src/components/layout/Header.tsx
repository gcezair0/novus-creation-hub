import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, GraduationCap, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Início", href: "/" },
  { label: "Sobre Nós", href: "/sobre" },
  { label: "Ensino", href: "/ensino" },
  { label: "Notícias", href: "/noticias" },
  { label: "Galeria", href: "/galeria" },
  { label: "Vídeos", href: "/videos" },
  { label: "Contato", href: "/contato" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b shadow-sm">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <div>
            <span className="font-heading font-bold text-lg text-primary leading-none block">
              Colégio Novo
            </span>
            <span className="font-heading text-xs text-muted-foreground leading-none">
              Heliópolis
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          {user ? (
            <>
              {isAdmin && (
                <Button asChild variant="outline" size="sm">
                  <Link to="/admin">Painel Admin</Link>
                </Button>
              )}
              <Button asChild variant="ghost" size="sm">
                <Link to="/portal">
                  <User className="h-4 w-4 mr-1" /> Portal
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button asChild size="sm">
              <Link to="/login">Entrar</Link>
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t bg-card p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 border-t space-y-2">
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-muted"
                  >
                    Painel Admin
                  </Link>
                )}
                <Link
                  to="/portal"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-muted"
                >
                  Portal do Aluno
                </Link>
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-muted"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground text-center"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
