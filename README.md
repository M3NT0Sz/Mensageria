# 🚗 Sistema de Corridas em Tempo Real# Mensageria



> **Sistema completo tipo Uber** construído com React, Node.js, RabbitMQ e Socket.IOAplicação Node.js para envio e consumo de mensagens utilizando RabbitMQ.



[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org)---

[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)

[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-3.11+-orange)](https://rabbitmq.com)## ⚡ **NOVO: Frontend React Moderno!**

[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7+-purple)](https://socket.io)

### 🚀 **Sistema Web com React + Context API**

## 🎯 **Sobre o Projeto**Agora o sistema possui uma interface React moderna e responsiva:



Sistema de corridas completo e moderno que simula o funcionamento de aplicativos como Uber, desenvolvido com **design inspirado no Uber** e arquitetura de microserviços usando mensageria em tempo real.- ✅ **React 18** com hooks modernos

- ✅ **Vite** para desenvolvimento rápido  

### ✨ **Características Principais**- ✅ **React Router** para navegação SPA

- ✅ **Context API** para gerenciamento de estado

- **🎨 Design Uber-like**: Interface moderna com paleta preta, branca e verde- ✅ **Socket.IO Client** para tempo real

- **⚡ Tempo Real**: WebSocket para atualizações instantâneas- ✅ **Design System** com componentes reutilizáveis

- **📱 Responsivo**: Funciona perfeitamente em desktop e mobile- ✅ **Responsivo** para desktop e mobile

- **🔄 Mensageria**: RabbitMQ para comunicação assíncrona robusta

- **🚀 React Moderno**: Hooks, Context API e componentes funcionais### 🎯 **Inicialização Rápida (React)**

- **📊 Dashboard Completo**: Monitoramento e estatísticas em tempo real

```bash

---# 1. Instalar dependências do backend

npm install

## 🚀 **Início Rápido**

# 2. Instalar dependências do frontend React  

### 1. **Instalação**npm run frontend:install

```bash

git clone https://github.com/M3NT0Sz/Mensageria.git# 3. Iniciar sistema

cd Mensagerianpm start

npm install```

npm run frontend:install

```### 🌐 **Interfaces React Disponíveis**



### 2. **Configuração**- **📋 Home**: http://localhost:3000 (React SPA)

```bash- **👤 Passageiro**: http://localhost:3000/passenger

# Copie o arquivo de ambiente- **🚗 Motorista**: http://localhost:3000/driver  

cp .env_example .env- **📊 Admin**: http://localhost:3000/admin



# Configure sua URL do RabbitMQ### 🛠️ **Desenvolvimento React**

RABBIT_URL=amqp://seu-rabbitmq-url

``````bash

# Modo desenvolvimento (hot reload frontend + backend)

### 3. **Execução**npm run dev

```bash

# Sistema completo (recomendado)# Apenas frontend React em desenvolvimento

npm startnpm run frontend:dev



# ou em desenvolvimento# Build do frontend para produção

npm run devnpm run frontend:build

``````



### 4. **Acesso**### ⚠️ **Notas Importantes**

- 🏠 **Home**: http://localhost:3000

- 🚶 **Passageiro**: http://localhost:3000/passenger- ✅ **Sistema migrado para React** - Interfaces HTML legadas foram removidas

- 🚗 **Motorista**: http://localhost:3000/driver- ✅ **Build automático** - `npm run system-react` faz build e inicia o sistema

- 📊 **Admin**: http://localhost:3000/admin- ✅ **Fallback inteligente** - Se React não estiver buildado, mostra instruções

- ✅ **Desenvolvimento otimizado** - Hot reload para frontend e backend

---

---

## 🛠️ **Stack Tecnológica**

## ✅ Sistema de Corridas (tipo Uber) - IMPLEMENTADO!

### **Frontend**

- **React 18** - Interface moderna e reativa### 🎯 Descrição

- **Vite** - Build tool ultrarrápidaSistema completo de corridas implementado utilizando mensageria RabbitMQ para comunicação em tempo real entre passageiros e motoristas, similar ao Uber.

- **React Router** - SPA com roteamento

- **Socket.IO Client** - WebSocket em tempo real### 🚀 Funcionalidades Implementadas

- **Lucide React** - Ícones modernos- ✅ Solicitação de corridas por passageiros

- **CSS Moderno** - Design system inspirado no Uber- ✅ Notificações em tempo real para motoristas disponíveis

- ✅ Aceite automático de corridas pelos motoristas

### **Backend**- ✅ Atualizações de status da corrida (a caminho, chegou, em andamento, finalizada)

- **Node.js & Express** - Servidor REST API- ✅ Sistema de monitoramento e estatísticas

- **Socket.IO** - WebSocket para tempo real- ✅ Simulação completa com múltiplos usuários

- **RabbitMQ** - Sistema de filas para mensageria- ✅ Geração de dados realistas (preços, veículos, telefones)

- **UUID** - Geração de IDs únicos

### 📁 Estrutura do Sistema de Corridas

### **Arquitetura**```

- **Microserviços** - Separação por domíniobackend/

- **Event-Driven** - Comunicação por eventos├── utils/

- **Real-time** - Atualizações instantâneas│   └── rabbitmq.js          # Utilitário para conexão RabbitMQ

- **RESTful API** - Endpoints padronizados├── ride-system.js           # Sistema principal de gerenciamento

├── passenger.js             # Simulador de passageiro

---├── driver.js                # Simulador de motorista

├── ride-status.js           # Gerenciador de status e monitoramento

## 💻 **Funcionalidades**└── demo.js                  # Demonstração completa do sistema

```

### 🚶 **Área do Passageiro**

- ✅ Login simples e rápido### 🔄 Filas Utilizadas

- ✅ Seleção de origem e destino- `corridas_pendentes`: Novas solicitações de corrida

- ✅ Cálculo automático de preço- `notificacoes_motorista_{id}`: Notificações específicas para cada motorista

- ✅ Acompanhamento da corrida em tempo real- `notificacoes_passageiro_{id}`: Notificações específicas para cada passageiro

- ✅ Notificações instantâneas de status

- ✅ Interface clean e intuitiva### 📊 Status das Corridas

- `PENDING`: Aguardando aceite de motorista

### 🚗 **Área do Motorista**  - `ACCEPTED`: Corrida aceita, motorista a caminho

- ✅ Controle online/offline- `DRIVER_ARRIVED`: Motorista chegou no local de coleta

- ✅ Recebimento de solicitações em tempo real- `IN_PROGRESS`: Corrida em andamento

- ✅ Aceite de corridas com um clique- `COMPLETED`: Corrida finalizada com sucesso

- ✅ Gerenciamento de status da corrida- `CANCELLED`: Corrida cancelada

- ✅ Histórico de corridas

- ✅ Interface profissional## � Sistema Web Integrado (Frontend + Backend)



### 📊 **Dashboard Admin**### 🚀 **NOVO: Interface Web Completa!**

- ✅ Estatísticas em tempo realSistema completo com interface web em tempo real integrada ao backend RabbitMQ, incluindo:

- ✅ Monitoramento de corridas ativas

- ✅ Usuários online (passageiros/motoristas)- ✅ **Interface Web para Passageiros** - Solicitar e acompanhar corridas

- ✅ Feed de atividades ao vivo- ✅ **Interface Web para Motoristas** - Receber e aceitar corridas  

- ✅ Métricas de performance- ✅ **Dashboard Administrativo** - Monitorar sistema em tempo real

- ✅ Interface executiva moderna- ✅ **WebSocket em Tempo Real** - Atualizações instantâneas

- ✅ **API REST Completa** - Endpoints para todas as operações

---- ✅ **Motoristas Automáticos** - Simuladores que aceitam corridas automaticamente



## 🏗️ **Arquitetura do Sistema**### 🎯 **Inicialização Rápida**



``````bash

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐# Instalar dependências

│   React Client  │    │   Node.js API   │    │    RabbitMQ     │npm install

│                 │    │                 │    │                 │

│  ┌─────────────┐│    │ ┌─────────────┐ │    │ ┌─────────────┐ │# Iniciar sistema completo (recomendado)

│  │ Passenger   ││◄──►│ │ REST API    │ │◄──►│ │ Corridas    │ │npm run system

│  │ Driver      ││    │ │ Socket.IO   │ │    │ │ Notificações│ │

│  │ Admin       ││    │ │ WebSocket   │ │    │ │ Status      │ │# Ou apenas servidor web

│  └─────────────┘│    │ └─────────────┘ │    │ └─────────────┘ │npm run web

└─────────────────┘    └─────────────────┘    └─────────────────┘```

```

### 🌐 **Interfaces Disponíveis**

### 🔄 **Fluxo de Corrida**

Após executar `npm run system`:

1. **Solicitação** → Passageiro solicita corrida

2. **Notificação** → RabbitMQ distribui para motoristas online- **📋 Página Principal**: http://localhost:3000

3. **Aceite** → Motorista aceita via WebSocket- **👤 Interface Passageiro**: http://localhost:3000/passenger  

4. **Atualização** → Status atualizado em tempo real- **🚗 Interface Motorista**: http://localhost:3000/driver

5. **Finalização** → Corrida concluída e dados salvos- **📊 Dashboard Admin**: http://localhost:3000/admin



---### 🎮 **Como Testar o Sistema Web**



## 🗂️ **Estrutura do Projeto**1. **Execute o sistema**: `npm run system`

2. **Abra 3 abas no navegador**:

```   - Aba 1: http://localhost:3000/passenger (Passageiro)

Mensageria/   - Aba 2: http://localhost:3000/driver (Motorista)  

├── 📁 backend/                 # Servidor Node.js   - Aba 3: http://localhost:3000/admin (Monitor)

│   ├── server.js              # Servidor principal + API3. **Faça login** em cada interface

│   ├── ride-system.js         # Core do sistema de corridas4. **Solicite uma corrida** como passageiro

│   └── utils/5. **Aceite a corrida** como motorista

│       └── rabbitmq.js        # Utilitários RabbitMQ6. **Acompanhe em tempo real** no admin

├── 📁 frontend/               # Aplicação React

│   ├── src/### ⚡ **Funcionalidades Web**

│   │   ├── components/        # Componentes reutilizáveis

│   │   ├── pages/             # Páginas (Home, Passenger, Driver, Admin)**Interface do Passageiro:**

│   │   ├── context/           # Context API (Socket, State)- Login simples por nome/ID

│   │   └── services/          # API calls- Seleção de origem e destino

│   ├── public/                # Assets estáticos- Acompanhamento em tempo real do status

│   └── dist/                  # Build de produção- Notificações instantâneas via WebSocket

├── package.json               # Dependências e scripts- Preço estimado da corrida

└── README.md                  # Este arquivo

```**Interface do Motorista:**

- Login com informações do veículo

---- Visualização de corridas pendentes

- Aceite de corridas com um clique

## 📜 **Scripts Disponíveis**- Controle de status da corrida

- Notificações em tempo real

```bash

# 🚀 Produção**Dashboard Administrativo:**

npm start                      # Inicia sistema completo- Estatísticas em tempo real

npm run build                  # Build do frontend- Lista de todas as corridas

- Usuários online (motoristas/passageiros)

# 🛠️ Desenvolvimento  - Controles administrativos

npm run dev                    # Modo desenvolvimento (hot reload)- Geração de corridas de teste

npm run frontend:dev           # Apenas frontend em dev

npm run backend:dev            # Apenas backend em dev### 🔧 **Scripts NPM Disponíveis**



# 📦 Build & Install```bash

npm run frontend:build         # Build do React# Sistema completo com interface web + motoristas automáticos

npm run frontend:install       # Instala deps do frontendnpm run system

```

# Apenas servidor web (sem motoristas automáticos)  

---npm run system-web



## 🔧 **Configuração Avançada**# Servidor web simples

npm run web

### **Variáveis de Ambiente**

```bash# Sistema de corridas por linha de comando (original)

# .envnpm run ride-demo

RABBIT_URL=amqp://localhost:5672npm run ride-monitor

PORT=3000npm run ride-test

NODE_ENV=production

```# Simuladores individuais

npm run passenger joao "Shopping" "Aeroporto"

### **RabbitMQ Setup**npm run driver motorista_jose

```bash```

# Local (Docker)

docker run -d --hostname rabbitmq --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management#### Cenários de Teste

```bash

# Ou use CloudAMQP (recomendado)# Demonstração completa (recomendado)

# https://www.cloudamqp.com/node demo.js complete

```

# Alta demanda (múltiplas corridas simultâneas)

---node demo.js high-demand



## 🎨 **Design System**# Apenas dados de teste

node demo.js test

### **Paleta de Cores Uber**```

- **Primária**: `#000000` (Preto Uber)

- **Secundária**: `#00c569` (Verde Uber) ### 💡 Exemplo de Fluxo Real

- **Neutra**: `#f6f6f6` (Cinza claro)1. **Passageiro solicita** → `corridas_pendentes` recebe nova solicitação

- **Accent**: `#1fb6ff` (Azul)2. **Motoristas disponíveis** → Recebem notificação da nova corrida

3. **Motorista aceita** → Status muda para `ACCEPTED`

### **Tipografia**4. **Passageiro é notificado** → Recebe dados do motorista e tempo estimado

- **Fonte**: Segoe UI, Roboto, Helvetica Neue5. **Updates automáticos** → `DRIVER_ARRIVED` → `IN_PROGRESS` → `COMPLETED`

- **Pesos**: 400 (Regular), 500 (Medium), 600 (Semibold)6. **Motorista fica disponível** → Pronto para nova corrida



---### 🔧 Comandos do Gerenciador de Status

```bash

## 🚦 **Status do Projeto**# Monitorar todas as corridas

node ride-status.js monitor

### ✅ **Implementado**

- [x] Sistema completo de corridas# Listar por status

- [x] Interface React moderna com design Ubernode ride-status.js list PENDING

- [x] WebSocket em tempo realnode ride-status.js list COMPLETED

- [x] RabbitMQ para mensageria

- [x] Dashboard administrativo# Atualizar status manualmente

- [x] Páginas independentes para cada usuárionode ride-status.js update ride_123 COMPLETED "Corrida finalizada"

- [x] Sistema responsivo

# Cancelar corrida

### 🚧 **Em Desenvolvimento**node ride-status.js cancel ride_123 "Problema técnico"

- [ ] Autenticação avançada

- [ ] Histórico de corridas# Gerar corridas de teste

- [ ] Sistema de avaliaçõesnode ride-status.js test 10

- [ ] Mapas integrados```



---### 📈 Estatísticas Disponíveis

- Total de corridas no sistema

## 🤝 **Contribuição**- Corridas por status (pendentes, em andamento, finalizadas)

- Taxa de conclusão de corridas

Contribuições são bem-vindas! Por favor:- Receita total gerada

- Tempo médio de resposta

1. Faça um fork do projeto

2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)

3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)## Pré-requisitos

4. Push para a branch (`git push origin feature/AmazingFeature`)

5. Abra um Pull Request- Node.js instalado

- Conta RabbitMQ (pode usar [CloudAMQP](https://www.cloudamqp.com/))

---- Variáveis de ambiente configuradas (ver `.env_example`)



## 📝 **Licença**---



Distribuído sob a licença ISC. Veja `LICENSE` para mais informações.## Instalação



---1. Clone o repositório:

    ```sh

## 👨‍💻 **Autor**    git clone <url-do-repositorio>

    cd Mensageria

**Matheus Mendes dos Santos**    ```

- GitHub: [@M3NT0Sz](https://github.com/M3NT0Sz)

- LinkedIn: [Matheus Mendes](https://linkedin.com/in/matheus-mendes-santos)2. Instale as dependências:

    ```sh

---    npm install

    ```

## 🎉 **Demonstração**

3. Configure o arquivo `.env` conforme o exemplo em `.env_example`:

### **Como Testar Completo**    ```

    RABBIT_URL=<sua_url_rabbitmq>

1. **Execute**: `npm start`    QUEUE=notificacoes

2. **Abra 3 abas**:    ```

   - 🚶 http://localhost:3000/passenger

   - 🚗 http://localhost:3000/driver  ---

   - 📊 http://localhost:3000/admin

3. **Faça login** em cada aba## Uso

4. **Solicite corrida** como passageiro

5. **Aceite corrida** como motorista### Iniciar o Sistema

6. **Monitore** tudo no admin em tempo real!

Execute o servidor web:

---

```sh

<div align="center">npm start

```

**🚗 Feito com ❤️ e muito ☕**

Ou em modo desenvolvimento (hot reload):

*Sistema de corridas moderno para demonstrar arquitetura de microserviços, mensageria em tempo real e interfaces responsivas.*

```sh

</div>npm run dev
```

---

## Estrutura dos arquivos principais

### 🎯 **Sistema de Corridas (Atual)**
- `backend/`: Sistema completo de corridas + Servidor Express + APIs
- `frontend/`: Interface React moderna + Build

### 📦 **Configuração**
- `package.json`: Dependências e scripts do projeto
- `.gitignore`: Arquivos ignorados pelo Git

---

## Licença

ISC

---

## Autor


[Matheus Mendes dos Santos](https://github.com/M3NT0Sz)

---

**Observação:** Este projeto evoluiu de um sistema básico de mensageria para um sistema completo de corridas estilo Uber usando React + Node.js + RabbitMQ.

    ## Histórico do Projeto

    **V1 - Sistema Básico de Mensageria:**
    - Sistema simples de produtor/consumidor com RabbitMQ
    - Configuração básica de filas e mensagens
    
    **V2 - Sistema de Corridas Atual:**  
    - Sistema completo tipo Uber com passageiros, motoristas e admin
    - Interface React moderna e responsiva
    - WebSocket para comunicação tempo real
    - Multiple simuladores automáticos
    - Dashboard administrativo com estatísticas
    - API REST + sistema de filas RabbitMQ
