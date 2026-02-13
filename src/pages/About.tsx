import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart } from "lucide-react";

const About = () => (
  <div>
    <section className="bg-primary text-primary-foreground py-16">
      <div className="container text-center">
        <h1 className="font-heading text-4xl font-bold mb-4">Sobre Nós</h1>
        <p className="opacity-90 max-w-2xl mx-auto">Conheça a história e os valores do Colégio Novo Heliópolis</p>
      </div>
    </section>

    <section className="py-16">
      <div className="container max-w-3xl">
        <h2 className="font-heading text-2xl font-bold mb-6">Nossa História</h2>
        <div className="prose prose-lg text-muted-foreground space-y-4">
          <p>
            O Colégio Novo Heliópolis nasceu com o compromisso de oferecer educação de qualidade 
            para a comunidade de Heliópolis e região. Ao longo dos anos, consolidou-se como 
            referência em ensino, formando cidadãos preparados para os desafios do mundo contemporâneo.
          </p>
          <p>
            Com uma equipe pedagógica dedicada e metodologias inovadoras, o colégio acompanha 
            cada aluno desde a Educação Infantil até o Ensino Fundamental II, garantindo um 
            aprendizado significativo e uma formação integral.
          </p>
        </div>
      </div>
    </section>

    <section className="py-16 bg-muted">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Target, title: "Missão", text: "Promover educação de excelência, formando cidadãos críticos, éticos e participativos na sociedade." },
            { icon: Eye, title: "Visão", text: "Ser reconhecido como referência em educação de qualidade na região, com ensino inovador e inclusivo." },
            { icon: Heart, title: "Valores", text: "Respeito, ética, responsabilidade, compromisso com o aprendizado e valorização da diversidade." },
          ].map((item) => (
            <Card key={item.title} className="border-none shadow-md">
              <CardContent className="p-8 text-center">
                <item.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-heading font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default About;
