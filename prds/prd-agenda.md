# Jona – Agenda de Conexões

## Overview

Ferramenta para gerenciar eventos sociais como aniversários e encontros.

## Problem Statement

Usuários precisam manter o vínculo com suas conexões por meio de lembretes e datas importantes.

## User Stories

- Como usuário, quero visualizar eventos do mês.
- Como usuário, quero adicionar lembretes com notificações.

## Requirements

### Functional Requirements

- Visualização mensal
- Adição de eventos com descrição e data
- Lembrete com notificação 1 dia antes
- Integração com Google Calendar

### Non-Functional Requirements

- Armazenamento seguro com criptografia
- Consentimento explícito para integração externa
- Acessibilidade com aria-labels por data/evento

## Success Metrics

- ≥ 50% dos usuários com ao menos 1 evento salvo
- ≥ 75% de eventos com lembrete ativado

## Implementation Notes

- Utilização do Google Calendar API
- Notificações via Firebase Cloud Messaging