import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const StudentPortal = () => {
  const { user } = useAuth();

  const { data: student } = useQuery({
    queryKey: ["my-student", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("students")
        .select("*, classes(name)")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: grades } = useQuery({
    queryKey: ["my-grades", student?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("grades")
        .select("*, subjects(name)")
        .eq("student_id", student!.id)
        .order("bimester");
      return data || [];
    },
    enabled: !!student,
  });

  const { data: comunicados } = useQuery({
    queryKey: ["comunicados-portal"],
    queryFn: async () => {
      const { data } = await supabase
        .from("posts")
        .select("id, title, created_at, excerpt")
        .eq("published", true)
        .eq("category", "comunicado")
        .order("created_at", { ascending: false })
        .limit(10);
      return data || [];
    },
  });

  // Group grades by subject
  const gradesBySubject = grades?.reduce((acc, g) => {
    const subjectName = (g.subjects as any)?.name || "—";
    if (!acc[subjectName]) acc[subjectName] = {};
    acc[subjectName][g.bimester] = g.grade;
    return acc;
  }, {} as Record<string, Record<number, number | null>>);

  return (
    <div className="py-8">
      <div className="container">
        <h1 className="font-heading text-3xl font-bold mb-2">Portal do Aluno</h1>
        <p className="text-muted-foreground mb-8">
          {student ? `Olá, ${student.full_name}!` : "Bem-vindo ao portal."}
        </p>

        {student ? (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Boletim Escolar</CardTitle>
                {student.classes && <p className="text-sm text-muted-foreground">Turma: {(student.classes as any).name}</p>}
              </CardHeader>
              <CardContent>
                {gradesBySubject && Object.keys(gradesBySubject).length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Disciplina</TableHead>
                        <TableHead className="text-center">1º Bim</TableHead>
                        <TableHead className="text-center">2º Bim</TableHead>
                        <TableHead className="text-center">3º Bim</TableHead>
                        <TableHead className="text-center">4º Bim</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(gradesBySubject).map(([subject, bimesters]) => (
                        <TableRow key={subject}>
                          <TableCell className="font-medium">{subject}</TableCell>
                          {[1, 2, 3, 4].map((b) => (
                            <TableCell key={b} className="text-center">
                              {bimesters[b] !== undefined && bimesters[b] !== null ? bimesters[b] : "—"}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-sm">Nenhuma nota lançada ainda.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Comunicados Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                {comunicados && comunicados.length > 0 ? (
                  <div className="space-y-3">
                    {comunicados.map((c) => (
                      <div key={c.id} className="border-b pb-3 last:border-0">
                        <h4 className="font-medium text-sm">{c.title}</h4>
                        <p className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString("pt-BR")}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Nenhum comunicado.</p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <p>Sua conta ainda não está vinculada a um aluno.</p>
              <p className="text-sm mt-2">Entre em contato com a secretaria para vincular seu cadastro.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentPortal;
