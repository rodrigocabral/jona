# Jona – Dashboard

## Overview

Página inicial com foco em sugestões de conexões, navegação entre recursos e alertas emocionais.

## Problem Statement

Usuários precisam ter acesso centralizado a conexões, agenda, diário e comunidades para manter o engajamento.

## User Stories

- Como usuário, quero visualizar sugestões de pessoas com valores parecidos.
- Como usuário, quero acessar funcionalidades através de uma barra de navegação intuitiva.

## Requirements

### Functional Requirements

- Cards com sugestões de conexão
- Barra inferior com navegação (Conexões, Agenda, Diário, Comunidades)
- Alerta emocional com sugestão de live
- Ícone de perfil para configurações

### Non-Functional Requirements

- Acessível com teclado e leitores de tela
- Sugestões anonimizadas via Grok 3
- Notificações via Firebase

## Success Metrics

- Acesso diário ≥ 60% dos usuários ativos
- Clique em sugestões ≥ 40%

## Implementation Notes

- Utilização de componentes Shadcn UI
- Integração com sistema de recomendação Grok 3