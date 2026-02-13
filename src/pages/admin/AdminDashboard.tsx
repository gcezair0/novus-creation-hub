import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, GraduationCap } from "lucide-react";

const AdminDashboard = () => {
  const { data: postCount } = useQuery({
    queryKey: ["admin-post-count"],
    queryFn: async () => {
      const { count } = await supabase.from("posts").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: studentCount } = useQuery({
    queryKey: ["admin-student-count"],
    queryFn: async () => {
      const { count } = await supabase.from("students").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: recentPosts } = useQuery({
    queryKey: ["admin-recent-posts"],
    queryFn: async () => {
      const { data } = await supabase.from("posts").select("id, title, category, published, created_at").order("created_at", { ascending: false }).limit(5);
      return data || [];
    },
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{postCount ?? "—"}</p>
              <p className="text-sm text-muted-foreground">Postagens</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{studentCount ?? "—"}</p>
              <p className="text-sm text-muted-foreground">Alunos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/30 flex items-center justify-center">
              <Users className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">—</p>
              <p className="text-sm text-muted-foreground">Usuários</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Postagens Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentPosts && recentPosts.length > 0 ? (
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{post.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{post.category}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${post.published ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                    {post.published ? "Publicado" : "Rascunho"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma postagem ainda.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
