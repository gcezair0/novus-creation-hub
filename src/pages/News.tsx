import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";

const categories = [
  { value: "all", label: "Todas" },
  { value: "comunicado", label: "Comunicados" },
  { value: "noticia", label: "Notícias" },
  { value: "evento", label: "Eventos" },
];

const News = () => {
  const [filter, setFilter] = useState("all");

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", filter],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (filter !== "all") query = query.eq("category", filter);
      const { data } = await query;
      return data || [];
    },
  });

  return (
    <div>
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container text-center">
          <h1 className="font-heading text-4xl font-bold mb-4">Notícias e Eventos</h1>
          <p className="opacity-90">Fique por dentro de tudo que acontece no colégio</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((c) => (
              <Button
                key={c.value}
                variant={filter === c.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(c.value)}
              >
                {c.label}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {post.cover_image_url && (
                    <img src={post.cover_image_url} alt={post.title} className="w-full h-48 object-cover" />
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-accent uppercase tracking-wider">
                        {post.category === "comunicado" ? "Comunicado" : post.category === "evento" ? "Evento" : "Notícia"}
                      </span>
                      {post.event_date && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.event_date).toLocaleDateString("pt-BR")}
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading font-semibold text-lg mb-2">{post.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>
                    <Link
                      to={`/noticias/${post.id}`}
                      className="text-primary text-sm font-medium mt-3 inline-flex items-center hover:underline"
                    >
                      Ler mais <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">Nenhuma publicação encontrada.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default News;
