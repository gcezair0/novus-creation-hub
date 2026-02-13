import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enrollment, setEnrollment] = useState("");
  const [enrollmentPassword, setEnrollmentPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Login realizado com sucesso!");
      navigate("/portal");
    }
  };

  const handleEnrollmentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const generatedEmail = `${enrollment}@aluno.escola.local`;
    const { error } = await supabase.auth.signInWithPassword({
      email: generatedEmail,
      password: enrollmentPassword,
    });
    setLoading(false);
    if (error) {
      toast.error("Matrícula ou senha inválida.");
    } else {
      toast.success("Login realizado com sucesso!");
      navigate("/portal");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="h-10 w-10 text-primary" />
          </Link>
          <CardTitle className="font-heading text-2xl">Entrar</CardTitle>
          <p className="text-sm text-muted-foreground">Acesse sua conta</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="enrollment" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="enrollment">Matrícula</TabsTrigger>
              <TabsTrigger value="email">E-mail</TabsTrigger>
            </TabsList>

            <TabsContent value="enrollment">
              <form onSubmit={handleEnrollmentLogin} className="space-y-4">
                <div>
                  <Label htmlFor="enrollment">Matrícula</Label>
                  <Input id="enrollment" value={enrollment} onChange={(e) => setEnrollment(e.target.value)} required placeholder="Digite sua matrícula" />
                </div>
                <div>
                  <Label htmlFor="enrollmentPassword">Senha</Label>
                  <Input id="enrollmentPassword" type="password" value={enrollmentPassword} onChange={(e) => setEnrollmentPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="email">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Não tem conta?{" "}
            <Link to="/registro" className="text-primary font-medium hover:underline">
              Cadastre-se
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
