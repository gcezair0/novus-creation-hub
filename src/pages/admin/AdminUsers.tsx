import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { toast } from "sonner";

const AdminUsers = () => {
  const queryClient = useQueryClient();

  const { data: profiles } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: roles } = useQuery({
    queryKey: ["admin-roles"],
    queryFn: async () => {
      const { data } = await supabase.from("user_roles").select("*");
      return data || [];
    },
  });

  const roleMap = roles?.reduce((acc, r) => {
    acc[r.user_id] = r.role;
    return acc;
  }, {} as Record<string, string>) || {};

  const toggleAdmin = useMutation({
    mutationFn: async (userId: string) => {
      const isCurrentlyAdmin = roleMap[userId] === "admin";
      if (isCurrentlyAdmin) {
        await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
      } else {
        await supabase.from("user_roles").insert({ user_id: userId, role: "admin" as any });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
      toast.success("Permissão atualizada!");
    },
    onError: () => toast.error("Erro ao atualizar permissão."),
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-6">Usuários</h1>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Papel</TableHead>
                <TableHead className="w-32">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles?.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">{profile.full_name || "Sem nome"}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded-full ${roleMap[profile.user_id] === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {roleMap[profile.user_id] === "admin" ? "Admin" : "Usuário"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAdmin.mutate(profile.user_id)}
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      {roleMap[profile.user_id] === "admin" ? "Remover" : "Tornar Admin"}
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

export default AdminUsers;
