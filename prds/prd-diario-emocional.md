# Jona – Diário Emocional

## Overview

Espaço para que o usuário registre como se sente e receba sugestões com base no seu estado emocional.

## Problem Statement

Usuários precisam de um canal seguro e privado para refletir sobre suas emoções e receber apoio.

## User Stories

- Como usuário, quero registrar emoções com emojis e texto.
- Como usuário, quero gravar áudio para expressar sentimentos.

## Requirements

### Functional Requirements

- Emojis de estado emocional (feliz, triste, neutro)
- Textarea para relato com até 500 caracteres
- Gravação de áudio (limite: 1 minuto)
- Sugestões de ações após registro

### Non-Functional Requirements

- Armazenamento local por padrão
- Consentimento para sincronização com nuvem
- Transcrição e descarte de áudio após análise por Grok 3

## Success Metrics

- ≥ 30% dos usuários com registros semanais
- ≥ 50% de sugestões clicadas após entrada

## Implementation Notes

- Transcrição de áudio com fallback local
- Análise emocional via Grok 3