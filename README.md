# 🕊️ Jona - Plataforma de Conexões Autênticas

Jona é uma plataforma que promove conexões humanas autênticas através de tecnologia empática e inteligência artificial responsável.

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Firebase
- Chaves de API (Grok 3, Meta Graph API, Google Calendar)

### Instalação

1. **Clone o repositório:**
```bash
git clone <repository-url>
cd jona
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp env.example .env.local
```
Preencha o arquivo `.env.local` com suas chaves de API reais.

4. **Execute o projeto:**
```bash
npm run dev
```

5. **Acesse no navegador:**
```
http://localhost:3000
```

### Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Gera build de produção
- `npm run start` - Executa build de produção
- `npm run lint` - Executa linter

## 🔧 Configuração de Ambiente

O projeto requer as seguintes variáveis de ambiente (veja `env.example`):

### Firebase
- Configuração completa do Firebase para autenticação e banco de dados
- Chaves admin para operações server-side

### APIs Externas
- **Grok 3**: Para moderação e sugestões inteligentes
- **Meta Graph API**: Para integração com Instagram
- **Google Calendar API**: Para sincronização de agenda

### Segurança
- Chave de criptografia AES-256 para dados sensíveis
- Secrets do NextAuth para autenticação

## 🎨 Tema Visual

* **Cores principais:**

  * Verde: `#4CAF50` (conexão)
  * Azul: `#2196F3` (confiança)
  * Branco: `#FFFFFF` (fundo)
  * Cinza: `#757575` (textos secundários)

* **Fonte:** Roboto (Google Fonts)

* **Ícone:** Pomba estilizada (representa paz)

## ♿ Acessibilidade

* Uso de `aria-label` em elementos interativos
* Contraste mínimo: **4.5:1** (WCAG 2.1)
* Suporte a navegação por teclado (ex.: tecla `Tab`)

## 📱 Responsividade

* Compatível com:

  * **Mobile:** a partir de 320px
  * **Desktop:** até 1280px

## 🛠️ Stack Tecnológico

* **Frontend:** Next.js, React, TypeScript, Tailwind CSS, Shadcn UI
* **Backend:** Google Firebase
* **Idioma e tom:** Português brasileiro, tom empático

---

# 🧭 Telas do Sistema

## Tela 1: **Boas-Vindas**

* Fundo branco, logo (100x100px) centralizado
* Título: `"Bem-vindo ao Jona"` (Verde, 24px, negrito)
* Subtítulo: `"Conecte-se de verdade..."` (Azul, 16px)
* Botão: `"Começar"` (Azul)
* Pop-up LGPD com texto e botão **Aceitar/Recusar**
* Rodapé: `Jona © 2025`

### Interações:

* "Começar" → Tela 2
* "Recusar" → Exibe alerta sobre funcionalidades limitadas

---

## Tela 2: **Onboarding (6 Perguntas)**

* Cabeçalho com logo (50x50px)
* Barra de progresso dinâmica (verde)
* Campo de texto: 500 caracteres
* Botões "Próximo" / "Voltar"
* Opção: "Conectar Instagram" (OAuth 2.0 via Meta Graph API)

### Segurança:

* Dados criptografados (AES-256)
* Dados do Instagram anonimizados

---

## Tela 3: **Dashboard (Página Inicial)**

* Cabeçalho com logo e ícone de perfil
* Seção de "Conexões para você" com cards
* Alerta emocional (ex.: "Sentimos sua falta")
* Barra de navegação inferior (ícones: Conexões, Agenda, Diário, Comunidades)

### Segurança:

* Sugestões baseadas em Grok 3
* Notificações via Firebase (criptografadas)

---

## Tela 4: **Chat**

* Lista de mensagens:

  * Esquerda: Usuário (fundo azul claro)
  * Direita: Contato (fundo verde claro)
* Campo de texto (200 caracteres)
* Sugestões de prompt (via Grok 3)
* Ícone de denúncia (30x30px)

### Segurança:

* Criptografia AES-256
* Moderação em tempo real por Grok 3

---

## Tela 5: **Agenda de Conexões**

* Visualização mensal
* Adição de eventos (data, descrição, lembrete)
* Notificações via Firebase
* Integração com Google Calendar API

### Segurança:

* Dados criptografados
* Consentimento explícito para sincronização

---

## Tela 6: **Diário Emocional**

* Emojis clicáveis (feliz, triste, neutro)
* Campo de texto e botão de gravar áudio (1 min)
* Sugestões baseadas em análise emocional (Grok 3)

### Segurança:

* Armazenamento local por padrão
* Transcrição e descarte do áudio após análise

---

## Tela 7: **Microcomunidades** ✅ IMPLEMENTADA

* Lista de grupos: Nome, descrição, membros
* Botões: "Juntar", "Novo Grupo"
* Seção de lives agendadas
* Formulário de criação com tags (ex.: `#yoga`)

### Funcionalidades Implementadas:

* ✅ Listagem de comunidades com filtros
* ✅ Busca por nome, descrição e tags
* ✅ Interface para criar novas comunidades
* ✅ Seção de lives agendadas
* ✅ Sistema de tags com hashtags
* ✅ Indicadores de membros e localização
* ✅ Estados "Membro" vs "Juntar-se"
* ✅ Design responsivo e acessível

### Segurança:

* Grupos moderados (Grok 3)
* Dados de participação criptografados

**Localização:** `/src/app/communities/page.tsx`

---

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Páginas do Next.js 13+ (App Router)
│   ├── dashboard/         # Dashboard principal
│   ├── agenda/           # Agenda de conexões
│   ├── diary/            # Diário emocional
│   ├── communities/      # Microcomunidades ✅
│   └── onboarding/       # Processo de onboarding
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes base (Shadcn UI)
│   ├── BottomNavigation.tsx
│   ├── EmotionalAlert.tsx
│   └── LGPDModal.tsx
├── lib/                 # Utilitários e configurações
└── types/              # Definições de tipos TypeScript
```

## 🔐 Segurança e Privacidade

* **Criptografia AES-256** para dados sensíveis
* **Moderação por IA** (Grok 3) em tempo real
* **Conformidade LGPD** com consentimento explícito
* **OAuth 2.0** para integrações externas
* **Armazenamento local** por padrão para dados pessoais

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Jona © 2025** - Conectando pessoas, construindo comunidades.
