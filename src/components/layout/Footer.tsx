import { Link } from "react-router-dom";
import { GraduationCap, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-8 w-8" />
            <div>
              <span className="font-heading font-bold text-lg leading-none block">Colégio Novo</span>
              <span className="text-xs opacity-80">Heliópolis</span>
            </div>
          </div>
          <p className="text-sm opacity-80 leading-relaxed">
            Educação de qualidade para formar cidadãos conscientes e preparados para o futuro.
          </p>
        </div>

        <div>
          <h3 className="font-heading font-semibold mb-4">Links Rápidos</h3>
          <nav className="flex flex-col gap-2 text-sm">
            <Link to="/sobre" className="opacity-80 hover:opacity-100 transition-opacity">Sobre Nós</Link>
            <Link to="/ensino" className="opacity-80 hover:opacity-100 transition-opacity">Níveis de Ensino</Link>
            <Link to="/noticias" className="opacity-80 hover:opacity-100 transition-opacity">Notícias</Link>
            <Link to="/contato" className="opacity-80 hover:opacity-100 transition-opacity">Contato</Link>
          </nav>
        </div>

        <div>
          <h3 className="font-heading font-semibold mb-4">Contato</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 opacity-80">
              <Phone className="h-4 w-4 shrink-0" />
              <span>(11) 2093-1413</span>
            </div>
            <div className="flex items-center gap-2 opacity-80">
              <Mail className="h-4 w-4 shrink-0" />
              <span>contato@colegionovoheliopolis.com.br</span>
            </div>
            <div className="flex items-start gap-2 opacity-80">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
              <span>Rua Cônego Xavier, 276 - Heliópolis, São Paulo - SP</span>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/20 py-4">
        <p className="text-center text-xs opacity-60">
          © {new Date().getFullYear()} Colégio Novo Heliópolis. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
