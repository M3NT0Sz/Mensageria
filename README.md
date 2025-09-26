# 🚗 Mensageria

Sistema de corridas em tempo real tipo Uber com React, Node.js e RabbitMQ.

## Sobre o Projeto

Este projeto simula o funcionamento completo de um aplicativo de corridas como Uber, implementando:
- Arquitetura de microserviços com mensageria
- Interfaces web modernas e responsivas
- Comunicação em tempo real via WebSocket
- Design system inspirado no Uber

## Instalação

```bash
# Clone o repositório
git clone https://github.com/M3NT0Sz/Mensageria.git
cd Mensageria

# Instale as dependências
npm install
npm run frontend:install

# Configure o ambiente
cp .env_example .env
# Edite o .env com sua URL do RabbitMQ

# Inicie o sistema
npm start
```

## 🌐 Acesso às Interfaces

- **Home**: http://localhost:3000 - Página inicial com seleção de perfil
- **Passageiro**: http://localhost:3000/passenger - Interface para solicitar corridas
- **Motorista**: http://localhost:3000/driver - Dashboard para aceitar e gerenciar corridas
- **Admin**: http://localhost:3000/admin - Painel administrativo com estatísticas

## 🛠️ Stack Tecnológica

### Frontend
- **React 18** - Framework moderno com hooks
- **Vite** - Build tool rápido para desenvolvimento
- **React Router** - Roteamento SPA
- **Socket.IO Client** - WebSocket em tempo real
- **Lucide React** - Ícones modernos
- **CSS moderno** - Design system inspirado no Uber

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web minimalista
- **Socket.IO** - WebSocket para comunicação bidirecional
- **RabbitMQ** - Sistema de filas para mensageria
- **UUID** - Geração de IDs únicos

## ✨ Funcionalidades Principais

### 👤 Interface do Passageiro
- Login simples e intuitivo
- Seleção de origem e destino
- Cálculo automático de preço estimado
- Acompanhamento da corrida em tempo real
- Notificações de status via WebSocket

### 🚗 Interface do Motorista
- Sistema de online/offline
- Recebimento de solicitações em tempo real
- Aceite de corridas com um clique
- Controle de status da corrida (a caminho, chegou, em andamento)
- Histórico de corridas realizadas

### 📊 Dashboard Administrativo
- Estatísticas em tempo real
- Monitoramento de corridas ativas
- Lista de usuários online
- Feed de atividades do sistema
- Métricas de performance

## 🎯 Como Usar

1. **Execute o sistema**: `npm start`
2. **Abra múltiplas abas** no navegador para simular diferentes usuários
3. **Faça login** como passageiro, motorista e admin
4. **Solicite uma corrida** na interface do passageiro
5. **Aceite a corrida** na interface do motorista
6. **Acompanhe em tempo real** no dashboard admin

## 🏗️ Arquitetura

O sistema utiliza uma arquitetura orientada a eventos:
- **Frontend React** se comunica via REST API e WebSocket
- **Backend Express** processa requisições e gerencia WebSocket
- **RabbitMQ** gerencia filas de mensagens entre componentes
- **Socket.IO** mantém conexão em tempo real com todos os clientes

## 🎨 Design

Interface moderna inspirada no Uber com:
- **Paleta de cores**: Preto (#000), Verde (#00c569), Branco
- **Tipografia**: Segoe UI, Roboto, Helvetica
- **Layout responsivo** para desktop e mobile
- **Componentes reutilizáveis** com design consistente

## 👨‍💻 Autor

**Matheus Mendes dos Santos**
- GitHub: [@M3NT0Sz](https://github.com/M3NT0Sz)