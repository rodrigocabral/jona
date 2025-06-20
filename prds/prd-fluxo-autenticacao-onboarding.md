# Jona – Fluxo de Autenticação e Onboarding

## Overview

Este documento descreve o fluxo de autenticação, criação de conta, onboarding e acesso ao dashboard no sistema jonA. O objetivo é garantir que somente usuários autenticados e com o onboarding completo possam acessar o conteúdo principal da plataforma.

## Problem Statement

Usuários não autenticados ou com onboarding incompleto não devem acessar funcionalidades principais. É necessário garantir a persistência do progresso do onboarding e o redirecionamento correto entre as etapas.

## User Stories

- Como visitante, quero ser redirecionado ao login ao acessar o jonA sem estar autenticado.
- Como novo usuário, quero criar uma conta e iniciar o onboarding imediatamente após o login.
- Como usuário em onboarding, quero que meu progresso seja salvo automaticamente caso eu feche a página.
- Como usuário, quero acessar o dashboard apenas após concluir o onboarding.

## Requirements

### Functional Requirements

- Redirecionamento automático de usuários não logados para a tela de login.
- Criação de conta via formulário na tela de login.
- Redirecionamento para o onboarding após login ou criação de conta.
- Persistência de progresso do onboarding (local ou remoto).
- Redirecionamento ao dashboard somente após conclusão do onboarding.

### Non-Functional Requirements

- Acessibilidade total nas rotas de login e onboarding.
- Armazenamento persistente com fallback seguro.
- Tempo de redirecionamento < 1 segundo.

## Success Metrics

- ≥ 95% dos usuários não logados redirecionados corretamente ao login.
- ≥ 90% dos usuários que iniciam o onboarding o concluem.
- < 5% dos usuários reclamando de perda de progresso no onboarding.

## Implementation Notes

- Middleware de proteção de rotas com Next.js (`middleware.ts`) para detectar sessão.
- Firebase Authentication para login, criação de conta e verificação de status.
- Progresso do onboarding armazenado no `Firestore` por `userId` ou localmente em `localStorage` com sincronização.
- Rota protegida `/dashboard` validará onboarding completo antes de permitir acesso.