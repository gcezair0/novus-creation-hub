import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

const getYoutubeId = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?#]+)/);
  return match ? match[1] : null;
};

const Videos = () => {
  const { data: videos } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const { data } = await supabase.from("videos").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  return (
    <div>
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container text-center">
          <h1 className="font-heading text-4xl font-bold mb-4">Vídeos</h1>
          <p className="opacity-90">Assista aos vídeos do Colégio Novo Heliópolis</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          {videos && videos.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video) => {
                const ytId = getYoutubeId(video.youtube_url);
                return (
                  <Card key={video.id} className="overflow-hidden">
                    <div className="aspect-video">
                      {ytId ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${ytId}`}
                          title={video.title}
                          className="w-full h-full"
                          allowFullScreen
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
                          URL inválida
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-heading font-semibold">{video.title}</h3>
                      {video.description && <p className="text-sm text-muted-foreground mt-1">{video.description}</p>}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">Nenhum vídeo disponível.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Videos;
