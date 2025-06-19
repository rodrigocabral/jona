# Jona – Technologies Chosen

| Camada        | Tecnologia                      |
|---------------|----------------------------------|
| Frontend      | Next.js + React + TypeScript    |
| UI Library    | Shadcn UI + Tailwind CSS         |
| Fonte         | Roboto (Google Fonts)            |
| Backend       | Firebase (Auth, Firestore, Storage, Functions) |
| Banco de Dados| Firebase Firestore (NoSQL)       |
| Notificações  | Firebase Cloud Messaging         |
| OAuth         | Meta Graph API (Instagram)       |
| Moderação     | Grok 3 (filtro de conteúdo e sugestões) |
| Acessibilidade| axe-core + ARIA                  |

## Implementation Notes

- A aplicação será hospedada via Vercel
- Firebase Functions para lógica de backend serverless
- Firestore usado como principal base de dados (substituindo MongoDB)
- Integração com Grok 3 via API externa
- Tailwind configurado com tema verde/azul e modo escuro opcional