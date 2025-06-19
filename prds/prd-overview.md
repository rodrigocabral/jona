# Jona – Telas Iniciais e Onboarding

## Overview

O Jona é uma plataforma de conexões empáticas que visa unir pessoas com valores semelhantes. Este documento cobre as três primeiras fases da interface: boas-vindas, onboarding e o dashboard inicial, além de ferramentas de interação como chat, agenda, diário emocional e microcomunidades.

Essas funcionalidades têm como objetivo guiar o usuário desde a chegada até o início de conexões significativas, mantendo a privacidade, acessibilidade e responsividade como pilares centrais.

---

## Problem Statement

Usuários que buscam conexões profundas e com valores compartilhados enfrentam dificuldade em encontrar plataformas que promovam relacionamentos humanos significativos, com segurança, empatia e moderação eficaz.

---

## User Stories

* Como **novo usuário**, quero ser guiado por um processo de boas-vindas para entender a proposta da plataforma e iniciar meu cadastro.
* Como **usuário em onboarding**, quero responder perguntas que reflitam meus valores para receber sugestões de conexões compatíveis.
* Como **usuário logado**, quero ver sugestões de conexões, acessar o chat e registrar meu estado emocional com facilidade.
* Como **usuário ativo**, quero me engajar com comunidades e lives que estejam alinhadas com meus interesses e emoções.

---

## Requirements

### Functional Requirements

* Exibir tela de boas-vindas com logo, título, subtítulo e botão “Começar”.
* Coletar respostas a 6 perguntas abertas com barra de progresso.
* Oferecer integração opcional com Instagram.
* Exibir sugestões de conexões personalizadas no dashboard.
* Disponibilizar chat com moderação em tempo real.
* Implementar agenda de conexões com notificações e integração com Google Calendar.
* Disponibilizar diário emocional com texto, emoji e gravação de áudio.
* Criar e listar microcomunidades e lives agendadas.

### Non-Functional Requirements

* **Acessibilidade:** suporte a `aria-label`, contraste mínimo 4.5:1, navegação por teclado.
* **Performance:** carregamento otimizado para mobile e desktop (320px–1280px).
* **Segurança:** criptografia AES-256 para dados sensíveis, anonimização de dados sociais, moderação automática com Grok 3.
* **Responsividade:** layout adaptável com base em Tailwind CSS.
* **LGPD:** pop-ups de consentimento com controle granular e política clara.

---

## Success Metrics

* **Taxa de conversão no onboarding:** ≥ 80% dos usuários que veem a tela 1 concluem a tela 2.
* **Tempo médio até primeira conexão:** ≤ 2 dias após onboarding.
* **Engajamento no diário emocional:** ≥ 30% dos usuários registram pelo menos uma entrada semanal.
* **Participação em comunidades:** ≥ 20% dos usuários ativos entram em ao menos 1 grupo.
* **Taxa de denúncia por abuso:** ≤ 0.5% com resolução em menos de 24h via Grok 3.

---

## Implementation Notes

* Utilizar **Next.js + React + TypeScript** para o frontend com componentes da **Shadcn UI** e estilo via **Tailwind CSS**.
* Backend baseado em **Firebase** para autenticação, banco de dados e notificações.
* Armazenamento seguro de dados com criptografia no Firebase e sincronização com Google Calendar onde aplicável.
* Moderação e recomendações comportamentais processadas via **Grok 3**.
