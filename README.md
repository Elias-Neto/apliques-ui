# bootstrap-ui

Shell React+shadcn para side-projects. Clone este repo para iniciar uma nova UI de cliente; paginas/componentes de dominio do cliente sao adicionados em `src/pages/` e `src/components/`.

Convencoes em `.aios-core/docs/dev/ui-conventions.md` do AIOS (`side-project-aios`).

## Comandos

- `npm install`
- `npm run dev` — sobe em `:8080` (precisa da `bootstrap-api` em `:3333`; configure `VITE_API_URL` em `.env`)
- `npm run lint`
- `npm run build`

## Antes da primeira pagina de dominio

- Popular `enum Module` em `src/types/enums.ts` com modulos comerciais reais.
- Popular `Permissions` espelhando o backend (cada cliente decide se cria enum proprio em `src/types/permissions.ts` ou consome strings).
- Substituir icones PWA em `public/` pelo branding do cliente.
