

# Recriação do Site - Colégio Novo Heliópolis

## Visão Geral
Recriar o site do Colégio Novo Heliópolis com design moderno e limpo, sistema de postagens com painel administrativo, área de pais/alunos com boletim online, e autenticação completa.

---

## 1. Páginas Públicas (Site Institucional)

### Página Inicial
- Hero banner com imagem do colégio e chamada principal
- Seções: Sobre, Níveis de ensino (Infantil, Fundamental I e II), Diferenciais
- Últimas notícias e eventos em destaque
- Galeria de fotos em carrossel
- Rodapé com contato, endereço, mapa e redes sociais

### Página "Sobre Nós"
- História do colégio, missão, visão e valores
- Equipe pedagógica

### Página "Níveis de Ensino"
- Educação Infantil, Ensino Fundamental I e II com descrição de cada segmento

### Página "Notícias e Eventos"
- Listagem com filtros por categoria (Comunicados, Notícias, Eventos)
- Página individual de cada postagem

### Página "Galeria"
- Grid de álbuns de fotos com visualização em lightbox

### Página "Vídeos"
- Grid de vídeos (embed do YouTube)

### Página "Contato"
- Formulário de contato, mapa, telefone e endereço

---

## 2. Área do Pai/Aluno (Login necessário)

### Login e Cadastro
- Autenticação por email/senha via Supabase Auth

### Painel do Aluno
- Visualização do boletim com notas por disciplina e bimestre
- Histórico de comunicados enviados pela escola

---

## 3. Painel Administrativo (Login de admin)

### Dashboard
- Resumo: total de alunos, postagens recentes, acessos

### Gerenciamento de Postagens
- Criar, editar e excluir Comunicados, Notícias e Eventos
- Editor de texto rico para conteúdo
- Upload de imagem de capa

### Galeria de Fotos
- Criar álbuns e fazer upload de múltiplas fotos

### Vídeos
- Adicionar vídeos por URL do YouTube com título e descrição

### Boletim Online
- Cadastro de alunos, turmas e disciplinas
- Lançamento de notas por bimestre
- Visualização e edição das notas

### Gerenciamento de Usuários
- Visualizar usuários cadastrados
- Atribuir papel de admin

---

## 4. Backend (Lovable Cloud / Supabase)

### Banco de Dados
- Tabelas: profiles, user_roles, posts, photo_albums, photos, videos, students, subjects, grades, classes

### Autenticação
- Email/senha com Supabase Auth
- Roles separados em tabela `user_roles` (admin, user)

### Storage
- Buckets para imagens de postagens e galeria de fotos

### Segurança
- RLS em todas as tabelas
- Função `has_role()` para verificar permissões de admin
- Admin só validado no servidor

---

## 5. Design
- Visual moderno, limpo e profissional
- Cores inspiradas no colégio (azul e branco)
- Totalmente responsivo (mobile-first)
- Navegação clara com menu principal e menu mobile

