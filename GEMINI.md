# GEMINI.md - Contexto do Projeto FIT.AI (Frontend)

Este documento serve como guia de contexto para o agente Gemini CLI atuar no projeto `bootcamp-treinos-frontend`.

## 🚀 Visão Geral do Projeto
O **FIT.AI** é uma plataforma de treinos inteligente. Este repositório contém o frontend da aplicação, focado em uma experiência de usuário moderna, rápida e responsiva.

### Stack Tecnológica
- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Linguagem:** TypeScript
- **Estilização:** [Tailwind CSS 4](https://tailwindcss.com/) (usando variáveis OKLCH)
- **Componentes:** [shadcn/ui](https://ui.shadcn.com/)
- **Autenticação:** [Better Auth](https://www.better-auth.com/)
- **Gerenciamento de Datas:** Day.js
- **Geração de Tipos API:** Orval

## 🛠️ Comandos Principais
- `pnpm dev`: Inicia o servidor de desenvolvimento em `http://localhost:3000`.
- `pnpm build`: Gera o build de produção.
- `pnpm start`: Inicia o servidor de produção após o build.
- `pnpm lint`: Executa o linter para verificar padrões de código.

## 📁 Estrutura de Diretórios e Convenções
- `@/app/`: Contém as rotas e a lógica de páginas (App Router).
  - `_lib/`: Lógica interna da aplicação (ex: `auth-client.ts`, integrações de API).
  - `(auth)/`: Agrupamento de rotas de autenticação.
- `@/components/`: Componentes React reutilizáveis.
  - `ui/`: Componentes base do shadcn/ui.
- `@/lib/`: Funções utilitárias e configurações globais.
- `@/public/`: Assets estáticos (imagens, svgs locais como `fitai-logo.svg`).

## 🔑 Autenticação e API
- **Backend:** O frontend consome uma API rodando em `http://localhost:8080`.
- **Better Auth:** 
  - O cliente é configurado em `@/app/_lib/auth-client.ts`.
  - Proteção de rotas no servidor via `authClient.getSession` passando os `headers()`.
- **CORS:** O backend deve estar configurado para aceitar `http://localhost:3000`.

## 🎨 Padrões de Design
- **Cores:** Utiliza o sistema de cores do shadcn/ui baseado em variáveis CSS no `globals.css` (OKLCH).
- **Tipografia:** 
  - Principal: `Inter Tight` (variável `--font-inter-tight`).
  - Mono: `Geist Mono`.
- **Fidelidade:** O projeto segue rigorosamente os designs do Figma (conforme documentado em `tasks/01.md`).

## ✍️ Regras de Desenvolvimento
1. **Tipagem Estrita:** Sempre defina interfaces para dados vindos da API.
2. **Surgical Updates:** Ao editar estilos, prefira classes do Tailwind 4 e respeite as variáveis do `globals.css`.
3. **Imagens:** Use o componente `Image` do Next.js com `priority` para LCP (Logo, Backgrounds) e `unoptimized` quando necessário para assets do Figma.
4. **Clean Code:** Siga as convenções do Socratic Architect (Feynman Technique para explicações e First Principles para soluções).
