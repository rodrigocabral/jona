# JonA – Onboarding (Mapa de Compatibilidade)

## Overview

Coleta de dados comportamentais e emocionais para alimentar o sistema de sugestão de conexões do JonA.

## Problem Statement

Usuários precisam fornecer informações relevantes que ajudem a plataforma a sugerir conexões alinhadas com seus valores.

## User Stories

- Como novo usuário, quero responder perguntas abertas para que minhas conexões sejam relevantes.
- Como usuário, quero poder conectar meu Instagram para enriquecer o perfil.

## Requirements

### Functional Requirements

- Exibir 6 perguntas abertas com campo de 500 caracteres
- Barra de progresso dinâmica (1/6 até 6/6)
- Botões “Voltar” e “Próximo”
- Integração opcional com Instagram via OAuth 2.0

### Non-Functional Requirements

- Acessibilidade total
- Criptografia AES-256 nas respostas
- Anonimização de dados sociais

## Success Metrics

- Conclusão do onboarding ≥ 80%
- Integração com Instagram ≥ 30%

## Implementation Notes

- Utilização de componente de formulário dinâmico
- Validação por caractere e limite de tempo
- Armazenamento criptografado no MongoDB