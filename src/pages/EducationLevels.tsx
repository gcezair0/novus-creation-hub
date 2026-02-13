import { Card, CardContent } from "@/components/ui/card";
import { Baby, BookOpen, School } from "lucide-react";

const levels = [
  {
    icon: Baby,
    title: "Educação Infantil",
    age: "2 a 5 anos",
    description: "Na Educação Infantil, a criança é o centro do processo educativo. Através de atividades lúdicas, brincadeiras e projetos, estimulamos o desenvolvimento cognitivo, motor, social e emocional. Nossa proposta valoriza a curiosidade natural e a criatividade dos pequenos.",
    highlights: ["Aprendizado lúdico", "Socialização", "Desenvolvimento motor", "Iniciação à leitura"],
  },
  {
    icon: BookOpen,
    title: "Ensino Fundamental I",
    age: "1º ao 5º ano",
    description: "O Ensino Fundamental I é a base para toda a vida escolar. Com uma abordagem que combina tradição e inovação, desenvolvemos as competências essenciais de leitura, escrita e raciocínio lógico-matemático, sempre com acompanhamento individualizado.",
    highlights: ["Alfabetização", "Raciocínio lógico", "Projetos interdisciplinares", "Acompanhamento individual"],
  },
  {
    icon: School,
    title: "Ensino Fundamental II",
    age: "6º ao 9º ano",
    description: "No Fundamental II, preparamos nossos alunos para os desafios acadêmicos e pessoais do Ensino Médio. Com professores especialistas em cada disciplina, desenvolvemos o pensamento crítico, a autonomia e a responsabilidade dos estudantes.",
    highlights: ["Professores especialistas", "Pensamento crítico", "Preparação para o Ensino Médio", "Projetos científicos"],
  },
];

const EducationLevels = () => (
  <div>
    <section className="bg-primary text-primary-foreground py-16">
      <div className="container text-center">
        <h1 className="font-heading text-4xl font-bold mb-4">Níveis de Ensino</h1>
        <p className="opacity-90 max-w-2xl mx-auto">Da Educação Infantil ao Ensino Fundamental II</p>
      </div>
    </section>

    <section className="py-16">
      <div className="container space-y-12">
        {levels.map((level, i) => (
          <Card key={level.title} className="overflow-hidden">
            <CardContent className="p-0">
              <div className={`flex flex-col ${i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"}`}>
                <div className="md:w-1/3 bg-primary/5 flex items-center justify-center p-12">
                  <level.icon className="h-24 w-24 text-primary/60" />
                </div>
                <div className="md:w-2/3 p-8">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="font-heading text-2xl font-bold">{level.title}</h2>
                    <span className="text-xs font-medium bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                      {level.age}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{level.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {level.highlights.map((h) => (
                      <span key={h} className="text-xs bg-muted px-3 py-1.5 rounded-full font-medium">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  </div>
);

export default EducationLevels;
