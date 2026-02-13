import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, BookOpen, Users, Star, ArrowRight, Baby, School, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useCallback } from "react";

const Index = () => {
  const { data: recentPosts } = useQuery({
    queryKey: ["recent-posts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(6);
      return data || [];
    },
  });

  const comunicados = recentPosts?.filter((p) => p.category === "comunicado") || [];
  const noticias = recentPosts?.filter((p) => p.category !== "comunicado") || [];

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = comunicados.length;

  const nextSlide = useCallback(() => {
    if (totalSlides > 0) setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = () => {
    if (totalSlides > 0) setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    if (totalSlides <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, totalSlides]);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-primary text-primary-foreground py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent/30 opacity-90" />
        <div className="container relative z-10 text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-extrabold mb-6 animate-fade-in">
            Colégio Novo Heliópolis
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Educação de qualidade que transforma vidas. Da Educação Infantil ao Ensino Fundamental II.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button asChild size="lg" variant="secondary" className="font-heading font-semibold">
              <Link to="/contato">Matricule-se</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/sobre">Conheça o Colégio</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Comunicados Carousel */}
      {comunicados.length > 0 && (
        <section className="py-16 bg-muted">
          <div className="container">
            <h2 className="font-heading text-3xl font-bold text-center mb-8">Comunicados</h2>
            <div className="relative max-w-3xl mx-auto">
              <div className="overflow-hidden rounded-xl">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {comunicados.map((post) => (
                    <div key={post.id} className="w-full flex-shrink-0 px-2">
                      <Card className="border-2 border-primary/10">
                        <CardContent className="p-8">
                          {post.cover_image_url && (
                            <img src={post.cover_image_url} alt={post.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                          )}
                          <span className="text-xs font-medium text-accent uppercase tracking-wider">Comunicado</span>
                          <h3 className="font-heading font-semibold text-xl mt-2 mb-2">{post.title}</h3>
                          <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{new Date(post.created_at).toLocaleDateString("pt-BR")}</span>
                            <Link to={`/noticias/${post.id}`} className="text-primary text-sm font-medium inline-flex items-center hover:underline">
                              Ler mais <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
              {totalSlides > 1 && (
                <>
                  <Button variant="outline" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 rounded-full bg-background shadow-md" onClick={prevSlide}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 rounded-full bg-background shadow-md" onClick={nextSlide}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <div className="flex justify-center gap-2 mt-4">
                    {comunicados.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${i === currentSlide ? "bg-primary" : "bg-primary/20"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Níveis de Ensino */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="font-heading text-3xl font-bold text-center mb-4">Níveis de Ensino</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Acompanhamos o desenvolvimento do seu filho em cada etapa
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Baby, title: "Educação Infantil", desc: "De 2 a 5 anos. Aprendizado lúdico e acolhedor para os primeiros passos." },
              { icon: BookOpen, title: "Fundamental I", desc: "1º ao 5º ano. Base sólida com foco em leitura, escrita e raciocínio." },
              { icon: School, title: "Fundamental II", desc: "6º ao 9º ano. Preparação completa para os desafios do Ensino Médio." },
            ].map((level) => (
              <Card key={level.title} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                    <level.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl mb-3">{level.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{level.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link to="/ensino">Ver detalhes <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-20 bg-muted">
        <div className="container">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">Nossos Diferenciais</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: GraduationCap, title: "Ensino de Qualidade", desc: "Professores qualificados e metodologia moderna" },
              { icon: Users, title: "Turmas Reduzidas", desc: "Atenção individualizada para cada aluno" },
              { icon: BookOpen, title: "Material Atualizado", desc: "Conteúdo pedagógico alinhado à BNCC" },
              { icon: Star, title: "Valores Humanos", desc: "Formação integral com ética e cidadania" },
            ].map((d) => (
              <div key={d.title} className="text-center p-6">
                <d.icon className="h-10 w-10 text-secondary mx-auto mb-4" />
                <h3 className="font-heading font-semibold mb-2">{d.title}</h3>
                <p className="text-muted-foreground text-sm">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Últimas Notícias */}
      {noticias.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container">
            <h2 className="font-heading text-3xl font-bold text-center mb-12">Últimas Notícias</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {noticias.slice(0, 3).map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {post.cover_image_url && (
                    <img src={post.cover_image_url} alt={post.title} className="w-full h-48 object-cover" />
                  )}
                  <CardContent className="p-6">
                    <span className="text-xs font-medium text-accent uppercase tracking-wider">
                      {post.category === "evento" ? "Evento" : "Notícia"}
                    </span>
                    <h3 className="font-heading font-semibold text-lg mt-2 mb-2">{post.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">{post.excerpt}</p>
                    <Link to={`/noticias/${post.id}`} className="text-primary text-sm font-medium mt-3 inline-flex items-center hover:underline">
                      Ler mais <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link to="/noticias">Ver todas as notícias</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">Venha conhecer o Colégio Novo Heliópolis</h2>
          <p className="opacity-90 mb-8 max-w-lg mx-auto">
            Agende uma visita e descubra por que somos referência em educação na região.
          </p>
          <Button asChild size="lg" variant="secondary" className="font-heading font-semibold">
            <Link to="/contato">Agende sua visita</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
