# JonA – Tela de Boas-Vindas

## Overview

Tela inicial da aplicação JonA, com objetivo de apresentar a proposta da plataforma e iniciar o processo de onboarding do usuário.

## Problem Statement

Usuários precisam entender rapidamente o propósito do JonA e sentir confiança para iniciar o uso da plataforma.

## User Stories

- Como novo usuário, quero ver uma interface acolhedora e clara para saber o que esperar da plataforma.
- Como novo usuário, quero aceitar ou recusar o uso de dados conforme a LGPD antes de prosseguir.

## Requirements

### Functional Requirements

- Exibir logo centralizado
- Título “Bem-vindo ao JonA” (verde)
- Subtítulo “Conecte-se de verdade com quem compartilha seus valores.” (azul)
- Botão “Começar”
- Pop-up LGPD com opção de aceitar ou recusar

### Non-Functional Requirements

- Acessibilidade: aria-label em todos os elementos interativos
- Contraste 4.5:1
- Responsivo para mobile e desktop

## Success Metrics

- Taxa de cliques no botão “Começar” ≥ 90%
- Concordância com LGPD ≥ 80%

## Implementation Notes

- Layout com Tailwind CSS
- Responsivo via Flex/Grid
- Controle de estado para LGPD