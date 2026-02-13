import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const AdminVideos = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", youtube_url: "" });

  const { data: videos } = useQuery({
    queryKey: ["admin-videos"],
    queryFn: async () => {
      const { data } = await supabase.from("videos").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const createVideo = useMutation({
    mutationFn: async () => {
      await supabase.from("videos").insert(form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      toast.success("Vídeo adicionado!");
      setForm({ title: "", description: "", youtube_url: "" });
      setOpen(false);
    },
    onError: () => toast.error("Erro ao adicionar vídeo."),
  });

  const deleteVideo = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("videos").delete().eq("id", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      toast.success("Vídeo excluído!");
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold">Vídeos</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Novo Vídeo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-heading">Adicionar Vídeo</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); createVideo.mutate(); }} className="space-y-4">
              <div>
                <Label>Título</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div>
                <Label>URL do YouTube</Label>
                <Input value={form.youtube_url} onChange={(e) => setForm({ ...form, youtube_url: e.target.value })} required placeholder="https://www.youtube.com/watch?v=..." />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              </div>
              <Button type="submit" className="w-full" disabled={createVideo.isPending}>Adicionar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="w-16">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos?.map((video) => (
                <TableRow key={video.id}>
                  <TableCell className="font-medium">{video.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground truncate max-w-[200px]">{video.youtube_url}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => deleteVideo.mutate(video.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminVideos;
