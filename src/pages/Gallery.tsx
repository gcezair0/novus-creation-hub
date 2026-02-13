import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";

const Gallery = () => {
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data: albums } = useQuery({
    queryKey: ["albums"],
    queryFn: async () => {
      const { data } = await supabase.from("photo_albums").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: photos } = useQuery({
    queryKey: ["photos", selectedAlbum],
    queryFn: async () => {
      const { data } = await supabase.from("photos").select("*").eq("album_id", selectedAlbum!).order("created_at");
      return data || [];
    },
    enabled: !!selectedAlbum,
  });

  return (
    <div>
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container text-center">
          <h1 className="font-heading text-4xl font-bold mb-4">Galeria de Fotos</h1>
          <p className="opacity-90">Momentos especiais do nosso colégio</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          {!selectedAlbum ? (
            albums && albums.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {albums.map((album) => (
                  <Card
                    key={album.id}
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedAlbum(album.id)}
                  >
                    {album.cover_image_url ? (
                      <img src={album.cover_image_url} alt={album.title} className="w-full h-48 object-cover" />
                    ) : (
                      <div className="w-full h-48 bg-muted flex items-center justify-center">
                        <Camera className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-heading font-semibold">{album.title}</h3>
                      {album.description && <p className="text-sm text-muted-foreground mt-1">{album.description}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12">Nenhum álbum disponível.</p>
            )
          ) : (
            <div>
              <button onClick={() => setSelectedAlbum(null)} className="text-primary font-medium mb-6 hover:underline inline-flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" /> Voltar aos álbuns
              </button>
              {photos && photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {photos.map((photo, i) => (
                    <img
                      key={photo.id}
                      src={photo.image_url}
                      alt={photo.caption || ""}
                      className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setLightboxIndex(i)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-12">Nenhuma foto neste álbum.</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <Dialog open={lightboxIndex !== null} onOpenChange={() => setLightboxIndex(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black/95 border-none">
          {photos && lightboxIndex !== null && (
            <div className="relative flex items-center justify-center min-h-[60vh]">
              <img src={photos[lightboxIndex].image_url} alt="" className="max-h-[80vh] max-w-full object-contain" />
              <button onClick={() => setLightboxIndex(null)} className="absolute top-4 right-4 text-white/80 hover:text-white">
                <X className="h-6 w-6" />
              </button>
              {lightboxIndex > 0 && (
                <button onClick={() => setLightboxIndex(lightboxIndex - 1)} className="absolute left-4 text-white/80 hover:text-white">
                  <ChevronLeft className="h-8 w-8" />
                </button>
              )}
              {lightboxIndex < photos.length - 1 && (
                <button onClick={() => setLightboxIndex(lightboxIndex + 1)} className="absolute right-4 text-white/80 hover:text-white">
                  <ChevronRight className="h-8 w-8" />
                </button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gallery;
