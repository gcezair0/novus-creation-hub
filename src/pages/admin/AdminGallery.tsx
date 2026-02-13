import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Camera } from "lucide-react";
import { toast } from "sonner";

const AdminGallery = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });

  const { data: albums } = useQuery({
    queryKey: ["admin-albums"],
    queryFn: async () => {
      const { data } = await supabase.from("photo_albums").select("*, photos(count)").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const createAlbum = useMutation({
    mutationFn: async () => {
      await supabase.from("photo_albums").insert(form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-albums"] });
      toast.success("Álbum criado!");
      setForm({ title: "", description: "" });
      setOpen(false);
    },
    onError: () => toast.error("Erro ao criar álbum."),
  });

  const deleteAlbum = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("photo_albums").delete().eq("id", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-albums"] });
      toast.success("Álbum excluído!");
    },
  });

  const addPhoto = async (albumId: string, file: File) => {
    const ext = file.name.split(".").pop();
    const path = `${albumId}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("gallery-photos").upload(path, file);
    if (uploadError) { toast.error("Erro no upload."); return; }
    const { data: { publicUrl } } = supabase.storage.from("gallery-photos").getPublicUrl(path);
    await supabase.from("photos").insert({ album_id: albumId, image_url: publicUrl });
    queryClient.invalidateQueries({ queryKey: ["admin-albums"] });
    toast.success("Foto adicionada!");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold">Galeria de Fotos</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Novo Álbum</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-heading">Novo Álbum</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); createAlbum.mutate(); }} className="space-y-4">
              <div>
                <Label>Título</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              </div>
              <Button type="submit" className="w-full" disabled={createAlbum.isPending}>Criar Álbum</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums?.map((album) => (
          <Card key={album.id} className="overflow-hidden">
            <div className="h-32 bg-muted flex items-center justify-center">
              {album.cover_image_url ? (
                <img src={album.cover_image_url} alt={album.title} className="w-full h-full object-cover" />
              ) : (
                <Camera className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-heading font-semibold mb-2">{album.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">
                {(album.photos as any)?.[0]?.count || 0} fotos
              </p>
              <div className="flex gap-2">
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (files) {
                        for (const file of Array.from(files)) {
                          await addPhoto(album.id, file);
                        }
                      }
                    }}
                  />
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <span>Adicionar Fotos</span>
                  </Button>
                </label>
                <Button variant="ghost" size="sm" onClick={() => deleteAlbum.mutate(album.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminGallery;
