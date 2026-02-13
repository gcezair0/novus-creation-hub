import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const PostDetail = () => {
  const { id } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const { data } = await supabase.from("posts").select("*").eq("id", id).single();
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="container py-20 text-center">Carregando...</div>;
  if (!post) return <div className="container py-20 text-center">Publicação não encontrada.</div>;

  return (
    <div className="py-12">
      <div className="container max-w-3xl">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link to="/noticias"><ArrowLeft className="h-4 w-4 mr-2" /> Voltar</Link>
        </Button>

        <span className="text-xs font-medium text-accent uppercase tracking-wider">
          {post.category === "comunicado" ? "Comunicado" : post.category === "evento" ? "Evento" : "Notícia"}
        </span>

        <h1 className="font-heading text-3xl md:text-4xl font-bold mt-2 mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(post.created_at).toLocaleDateString("pt-BR")}
          </span>
        </div>

        {post.cover_image_url && (
          <img src={post.cover_image_url} alt={post.title} className="w-full h-64 md:h-96 object-cover rounded-lg mb-8" />
        )}

        <div className="prose prose-lg max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: post.content || "" }} />
      </div>
    </div>
  );
};

export default PostDetail;
