# Jona – Microcomunidades

## Overview

Funcionalidade para criação, participação e interação em pequenos grupos com interesses compartilhados.

## Problem Statement

Usuários desejam participar de grupos menores e focados em temas específicos, promovendo conexões mais significativas.

## User Stories

- Como usuário, quero entrar em comunidades com temas que me interessam.
- Como usuário, quero participar de lives organizadas por essas comunidades.

## Requirements

### Functional Requirements

- Lista de grupos com cards
- Botão “Juntar” e “Novo Grupo”
- Formulário de criação de grupo (nome, descrição, tags)
- Listagem de lives com botão “Participar”

### Non-Functional Requirements

- Dados criptografados
- Moderação automática dos grupos via Grok 3
- Interface acessível e responsiva

## Success Metrics

- ≥ 20% dos usuários ativos em ao menos 1 grupo
- ≥ 10% de participação em lives

## Implementation Notes

- Cadastro de grupos e eventos no MongoDB
- Lives com integração de sistema de streaming (futuro)