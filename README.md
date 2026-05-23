# bootstrap-ui

Casca React+shadcn para side-projects. Clone este repo para iniciar uma nova UI de cliente; páginas e componentes de domínio do cliente vão em `src/features/<dominio>/`.

Convenções em `.aios-core/docs/dev/ui-conventions.md` do AIOS (`side-project-aios`).

## Stack

Vite + React 18 + TypeScript + shadcn/ui + Tailwind + TanStack Query. PWA via `vite-plugin-pwa`.

## Comandos

```bash
npm install
npm run dev       # sobe em :8080 (precisa da bootstrap-api em :3333; configure VITE_API_URL no .env)
npm run lint
npm run build
npm run preview
```

## Variáveis de ambiente

```bash
cp .env.example .env
```

| Variável | Descrição | Exemplo |
|---|---|---|
| `VITE_API_URL` | URL base da API | `http://localhost:3333` |

## Features incluídas

| Feature | Rota | Descrição |
|---|---|---|
| Auth | `/login` | Login com JWT; interceptor axios trata 401 (logout) e 402 (suspensão) |
| Home | `/home` | Painel de boas-vindas |
| Minha conta | `/minha-conta/meus-dados` | Dados pessoais e da empresa (visível conforme permissão) |
| Minha mensalidade | `/minha-mensalidade` | Status da assinatura e cobrança em aberto (requer `billing.me.show`) |
| Pessoas | `/pessoas` | CRUD de usuários do tenant (requer `management.people.list`) |
| Permissões | `/configuracoes/permissionamento` | Grupos de permissão do tenant (requer `management.permission-groups.list`) |
| Tenants (admin) | `/admin/tenants` | Gestão de tenants pela plataforma (requer `platform.tenants.list`) |
| Billing (admin) | `/admin/billing` | Gestão de cobranças pela plataforma (requer `platform.billing.list`) |

## Modelo de permissões

Permissões chegam no payload do `GET /management/people/me` e ficam no `UserContext`. O menu lateral, as seções e os componentes de página verificam as permissões diretamente via `user.permissions.includes(Permission.X)`.

Enums em `src/types/enums.ts` (`Module`, `Permission`) — espelham `src/types/permissions.enums.ts` da API.

## Billing e suspensão

- `SubscriptionBanner` — exibido no topo para tenants com pagamento próximo do vencimento ou em atraso (até 14 dias)
- `RegularizacaoView` — substitui toda a UI quando `subscriptionStatus === 'suspended'`; detectado via `user.subscriptionStatus` do `/me` (funciona para qualquer papel, incluindo funcionários sem `billing.me.show`)
- O axios interceptor redireciona para `/minha-mensalidade` ao receber **402** da API

## Antes da primeira página de domínio

- Popular `enum Module` e `Permission` em `src/types/enums.ts` com os módulos/permissões do cliente
- Adicionar itens de menu em `src/config/nav.ts` conforme as rotas de domínio
- Substituir ícones PWA em `public/` pelo branding do cliente
- Ajustar a chave PIX em `src/features/billing/components/RegularizacaoView.tsx`
