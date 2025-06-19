# Jona – Chat

## Overview

Canal de conversa entre usuários com moderação automatizada e segurança de dados.

## Problem Statement

Usuários precisam conversar com segurança, privacidade e moderação ativa para promover relacionamentos saudáveis.

## User Stories

- Como usuário, quero enviar e receber mensagens facilmente.
- Como usuário, quero poder denunciar conteúdos impróprios.

## Requirements

### Functional Requirements

- Interface de chat com mensagens à esquerda (usuário) e direita (contato)
- Campo de texto e botão “Enviar”
- Botão de denúncia visível
- Sugestões de prompt

### Non-Functional Requirements

- Mensagens criptografadas com AES-256
- Moderação via Grok 3 em tempo real
- Armazenamento seguro e anonimização de conteúdos

## Success Metrics

- Envio médio de 5+ mensagens por sessão
- Tempo médio de resposta < 2 minutos
- Denúncias resolvidas em < 24h

## Implementation Notes

- Firebase como backend de mensagens
- Moderação embutida usando Webhooks com Grok 3