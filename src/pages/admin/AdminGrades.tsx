import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const AdminGrades = () => {
  const queryClient = useQueryClient();

  const { data: classes } = useQuery({
    queryKey: ["admin-classes"],
    queryFn: async () => {
      const { data } = await supabase.from("classes").select("*").order("name");
      return data || [];
    },
  });

  const { data: subjects } = useQuery({
    queryKey: ["admin-subjects"],
    queryFn: async () => {
      const { data } = await supabase.from("subjects").select("*").order("name");
      return data || [];
    },
  });

  const { data: students } = useQuery({
    queryKey: ["admin-students"],
    queryFn: async () => {
      const { data } = await supabase.from("students").select("*, classes(name)").order("full_name");
      return data || [];
    },
  });

  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedBimester, setSelectedBimester] = useState<string>("1");

  const filteredStudents = students?.filter((s) => s.class_id === selectedClass) || [];

  // Fetch ALL grades for this class+subject (all bimesters) to compute average
  const { data: allGrades } = useQuery({
    queryKey: ["admin-all-grades", selectedClass, selectedSubject],
    queryFn: async () => {
      const studentIds = filteredStudents.map((s) => s.id);
      if (studentIds.length === 0) return [];
      const { data } = await supabase
        .from("grades")
        .select("*")
        .in("student_id", studentIds)
        .eq("subject_id", selectedSubject);
      return data || [];
    },
    enabled: !!selectedClass && !!selectedSubject && filteredStudents.length > 0,
  });

  // Grade map for current bimester
  const gradeMap = allGrades?.reduce((acc, g) => {
    if (g.bimester === parseInt(selectedBimester)) {
      acc[g.student_id] = g;
    }
    return acc;
  }, {} as Record<string, any>) || {};

  // Compute average per student (sum of all 4 bimesters / 4)
  const averageMap: Record<string, number | null> = {};
  if (allGrades) {
    const grouped: Record<string, (number | null)[]> = {};
    allGrades.forEach((g) => {
      if (!grouped[g.student_id]) grouped[g.student_id] = [null, null, null, null];
      grouped[g.student_id][g.bimester - 1] = g.grade;
    });
    Object.entries(grouped).forEach(([studentId, bimesters]) => {
      const validGrades = bimesters.filter((g): g is number => g !== null);
      averageMap[studentId] = validGrades.length === 4 ? validGrades.reduce((a, b) => a + b, 0) / 4 : null;
    });
  }

  const saveGrade = useMutation({
    mutationFn: async ({ studentId, grade }: { studentId: string; grade: number }) => {
      const existing = gradeMap[studentId];
      if (existing) {
        await supabase.from("grades").update({ grade }).eq("id", existing.id);
      } else {
        await supabase.from("grades").insert({
          student_id: studentId,
          subject_id: selectedSubject,
          bimester: parseInt(selectedBimester),
          grade,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-grades"] });
      toast.success("Nota salva!");
    },
  });

  const [classOpen, setClassOpen] = useState(false);
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [studentOpen, setStudentOpen] = useState(false);
  const [newClass, setNewClass] = useState({ name: "", year: new Date().getFullYear() });
  const [newSubject, setNewSubject] = useState("");
  const [newStudent, setNewStudent] = useState({ full_name: "", class_id: "", enrollment_number: "" });
  const [createdCredentials, setCreatedCredentials] = useState<{ login: string; password: string } | null>(null);

  const createClass = useMutation({
    mutationFn: async () => { await supabase.from("classes").insert(newClass); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-classes"] }); toast.success("Turma criada!"); setClassOpen(false); setNewClass({ name: "", year: new Date().getFullYear() }); },
  });

  const createSubject = useMutation({
    mutationFn: async () => { await supabase.from("subjects").insert({ name: newSubject }); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-subjects"] }); toast.success("Disciplina criada!"); setSubjectOpen(false); setNewSubject(""); },
  });

  const createStudent = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-student-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`,
          "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          full_name: newStudent.full_name,
          enrollment_number: newStudent.enrollment_number,
          class_id: newStudent.class_id || null,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-students"] });
      setCreatedCredentials(data.credentials);
      toast.success("Aluno cadastrado com usuário criado!");
      setNewStudent({ full_name: "", class_id: "", enrollment_number: "" });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteStudent = useMutation({
    mutationFn: async (id: string) => { await supabase.from("students").delete().eq("id", id); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-students"] }); toast.success("Aluno excluído!"); },
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-6">Boletim Online</h1>

      <Tabs defaultValue="grades">
        <TabsList className="mb-6">
          <TabsTrigger value="grades">Lançar Notas</TabsTrigger>
          <TabsTrigger value="students">Alunos</TabsTrigger>
          <TabsTrigger value="config">Turmas & Disciplinas</TabsTrigger>
        </TabsList>

        <TabsContent value="grades">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Lançamento de Notas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <Label>Turma</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {classes?.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Disciplina</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {subjects?.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Bimestre</Label>
                  <Select value={selectedBimester} onValueChange={setSelectedBimester}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4].map((b) => <SelectItem key={b} value={b.toString()}>{b}º Bimestre</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedClass && selectedSubject && filteredStudents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aluno</TableHead>
                      <TableHead className="w-32">Nota</TableHead>
                      <TableHead className="w-24 text-center">Média</TableHead>
                      <TableHead className="w-20">Salvar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => {
                      const currentGrade = gradeMap[student.id]?.grade ?? "";
                      const avg = averageMap[student.id];
                      return (
                        <TableRow key={student.id}>
                          <TableCell>{student.full_name}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.1"
                              min="0"
                              max="10"
                              defaultValue={currentGrade}
                              id={`grade-${student.id}`}
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {avg !== null && avg !== undefined ? (
                              <span className={`font-semibold ${avg >= 6 ? "text-green-600" : "text-destructive"}`}>
                                {avg.toFixed(1)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-xs">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const input = document.getElementById(`grade-${student.id}`) as HTMLInputElement;
                                if (input.value) saveGrade.mutate({ studentId: student.id, grade: parseFloat(input.value) });
                              }}
                            >
                              OK
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : selectedClass ? (
                <p className="text-sm text-muted-foreground">Nenhum aluno nesta turma.</p>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <div className="flex justify-end mb-4">
            <Dialog open={studentOpen} onOpenChange={setStudentOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" /> Novo Aluno</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Cadastrar Aluno</DialogTitle></DialogHeader>
                {createdCredentials ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg space-y-2">
                      <p className="font-semibold text-green-700 dark:text-green-300">✅ Aluno cadastrado com sucesso!</p>
                      <p className="text-sm"><strong>Login (matrícula):</strong> {createdCredentials.login}</p>
                      <p className="text-sm"><strong>Senha:</strong> {createdCredentials.password}</p>
                      <p className="text-xs text-muted-foreground mt-2">Anote essas credenciais. A senha é a matrícula do aluno.</p>
                    </div>
                    <Button className="w-full" onClick={() => { setCreatedCredentials(null); setStudentOpen(false); }}>Fechar</Button>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); createStudent.mutate(); }} className="space-y-4">
                    <div><Label>Nome Completo</Label><Input value={newStudent.full_name} onChange={(e) => setNewStudent({ ...newStudent, full_name: e.target.value })} required /></div>
                    <div><Label>Matrícula (será o login e senha)</Label><Input value={newStudent.enrollment_number} onChange={(e) => setNewStudent({ ...newStudent, enrollment_number: e.target.value })} required /></div>
                    <div>
                      <Label>Turma</Label>
                      <Select value={newStudent.class_id} onValueChange={(v) => setNewStudent({ ...newStudent, class_id: v })}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          {classes?.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full" disabled={createStudent.isPending}>
                      {createStudent.isPending ? "Cadastrando..." : "Cadastrar Aluno"}
                    </Button>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Turma</TableHead>
                    <TableHead className="w-16">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students?.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.full_name}</TableCell>
                      <TableCell className="text-muted-foreground">{s.enrollment_number || "—"}</TableCell>
                      <TableCell>{(s.classes as any)?.name || "—"}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => deleteStudent.mutate(s.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-heading text-lg">Turmas</CardTitle>
                <Dialog open={classOpen} onOpenChange={setClassOpen}>
                  <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nova</Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Nova Turma</DialogTitle></DialogHeader>
                    <form onSubmit={(e) => { e.preventDefault(); createClass.mutate(); }} className="space-y-4">
                      <div><Label>Nome</Label><Input value={newClass.name} onChange={(e) => setNewClass({ ...newClass, name: e.target.value })} required placeholder="Ex: 5ºA" /></div>
                      <div><Label>Ano</Label><Input type="number" value={newClass.year} onChange={(e) => setNewClass({ ...newClass, year: parseInt(e.target.value) })} /></div>
                      <Button type="submit" className="w-full">Criar</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {classes?.map((c) => (
                    <div key={c.id} className="flex justify-between items-center p-2 bg-muted rounded-md">
                      <span className="text-sm font-medium">{c.name} ({c.year})</span>
                    </div>
                  ))}
                  {(!classes || classes.length === 0) && <p className="text-sm text-muted-foreground">Nenhuma turma cadastrada.</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-heading text-lg">Disciplinas</CardTitle>
                <Dialog open={subjectOpen} onOpenChange={setSubjectOpen}>
                  <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nova</Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Nova Disciplina</DialogTitle></DialogHeader>
                    <form onSubmit={(e) => { e.preventDefault(); createSubject.mutate(); }} className="space-y-4">
                      <div><Label>Nome</Label><Input value={newSubject} onChange={(e) => setNewSubject(e.target.value)} required placeholder="Ex: Matemática" /></div>
                      <Button type="submit" className="w-full">Criar</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {subjects?.map((s) => {
                    // Calculate average for this subject across all students and bimesters
                    const subjectGrades = allGrades?.filter(g => g.subject_id === s.id && g.grade !== null).map(g => g.grade) || [];
                    const avg = subjectGrades.length > 0 ? subjectGrades.reduce((a, b) => a + b, 0) / subjectGrades.length : null;
                    return (
                      <div key={s.id} className="flex justify-between items-center p-3 bg-muted rounded-md">
                        <span className="text-sm font-medium">{s.name}</span>
                        {avg !== null ? (
                          <span className={`text-sm font-semibold ${avg >= 6 ? "text-green-600" : "text-destructive"}`}>
                            Média: {avg.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Sem notas</span>
                        )}
                      </div>
                    );
                  })}
                  {(!subjects || subjects.length === 0) && <p className="text-sm text-muted-foreground">Nenhuma disciplina cadastrada.</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminGrades;
