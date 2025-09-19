# Sistema de Mensageria com RabbitMQ

Sistema completo de mensageria utilizando RabbitMQ com arquitetura moderna separada em três módulos:

- **Servidor**: Backend Node.js com Express e RabbitMQ
- **Produtor**: Interface React para envio de mensagens
- **Consumidor**: Interface React para monitoramento de mensagens

## 🏗️ Arquitetura

```
Mensageria/
├── servidor/          # Backend API (Node.js + Express + RabbitMQ)
│   ├── server.js      # Servidor principal
│   ├── package.json   # Dependências do servidor
│   └── .env          # Configurações do ambiente
├── produtor/          # Frontend para envio (React + Vite)
│   ├── src/          # Código fonte React
│   ├── package.json  # Dependências do produtor
│   └── vite.config.js # Configuração do Vite
└── consumidor/        # Frontend para monitoramento (React + Vite)
    ├── src/          # Código fonte React
    ├── package.json  # Dependências do consumidor
    └── vite.config.js # Configuração do Vite
```

## 🚀 Como Executar

### Pré-requisitos

1. **Node.js** (versão 16 ou superior)
2. **RabbitMQ** (opcional - o sistema funciona sem ele)

#### ⚡ Instalação Rápida do RabbitMQ

**🐳 Docker (Mais Fácil)**
```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

**🪟 Windows**
```powershell
# Via Chocolatey (como administrador)
choco install rabbitmq

# Ou baixe em: https://www.rabbitmq.com/download.html
```

**🔍 Verificar se está funcionando:**
- Interface Web: http://localhost:15672 (guest/guest)
- Status do serviço: `sc query RabbitMQ` no PowerShell

#### ⚠️ Sistema Sem RabbitMQ
O sistema foi projetado para funcionar mesmo sem RabbitMQ:
- ✅ Interface do Produtor funciona normalmente
- ✅ Interface do Consumidor com simulação
- ⚠️ Mensagens não serão persistidas até RabbitMQ estar ativo

**Opção 1: Docker (Recomendado)**
```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

**Opção 2: Download Direto**
- Windows: [Download RabbitMQ](https://www.rabbitmq.com/download.html)
- Após a instalação, o RabbitMQ iniciará automaticamente

**⚠️ Nota**: O sistema funcionará mesmo sem RabbitMQ, operando em modo simulação.

### 1. Instalar Dependências

```bash
# Servidor
cd servidor
npm install

# Produtor
cd ../produtor
npm install

# Consumidor  
cd ../consumidor
npm install
```

### 2. Configurar Ambiente

Edite o arquivo `servidor/.env` conforme necessário:

```env
PORT=3001
RABBIT_URL=amqp://localhost
QUEUE=notificacoes
NODE_ENV=development
```

### 3. Executar o Sistema

**Terminal 1 - Servidor:**
```bash
cd servidor
npm run dev
```

**Terminal 2 - Produtor:**
```bash
cd produtor
npm run dev
```

**Terminal 3 - Consumidor:**
```bash
cd consumidor
npm run dev
```

### 4. Acessar as Aplicações

- **Servidor API**: http://localhost:3001
- **Produtor**: http://localhost:3000
- **Consumidor**: http://localhost:3002
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)

## 🔄 Modo Simulação

Se o RabbitMQ não estiver disponível, o sistema funcionará em **modo simulação**:

- ✅ Servidor iniciará normalmente
- ✅ Interface funcionará completamente  
- ✅ Mensagens serão "simuladas" (logs no servidor)
- ✅ Botão de reconexão disponível nas interfaces
- ⚠️ Mensagens não serão persistidas na fila

**Para conectar o RabbitMQ posteriormente:**
1. Execute: `docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management`
2. Clique em "Reconectar RabbitMQ" nas interfaces
3. O sistema mudará automaticamente para o modo completo

### 📋 Funcionalidades

### Servidor (Backend)
- ✅ API REST para envio de mensagens
- ✅ Conexão resiliente com RabbitMQ
- ✅ Funciona mesmo sem RabbitMQ ativo
- ✅ Reconexão automática
- ✅ Health check e status da fila
- ✅ CORS configurado

### Produtor (Frontend)
- ✅ Interface para envio de mensagens
- ✅ Status da conexão RabbitMQ em tempo real
- ✅ Geração de exemplos automáticos
- ✅ Validação de formulário
- ✅ Design responsivo
- ✅ Botão para reconectar RabbitMQ

### Consumidor (Frontend)
- ✅ Monitoramento de mensagens
- ✅ Status da conexão RabbitMQ
- ✅ Simulação de recebimento
- ✅ Auto-refresh configurável
- ✅ Estatísticas em tempo real
- ✅ Interface intuitiva

## 🔧 Solução de Problemas

### RabbitMQ não conecta
```bash
# Verificar se está rodando
docker ps | grep rabbitmq

# Reiniciar container
docker restart rabbitmq

# Verificar logs
docker logs rabbitmq
```

### Portas em uso
- Servidor: 3001
- Produtor: 3000  
- Consumidor: 3002
- RabbitMQ: 5672, 15672

Use `netstat -an | findstr :3000` para verificar portas em uso.

## 🔧 Scripts Disponíveis

### Servidor
```bash
npm start      # Produção
npm run dev    # Desenvolvimento com nodemon
```

### Produtor/Consumidor
```bash
npm run dev    # Desenvolvimento
npm run build  # Build para produção
npm run preview # Preview do build
```

## 📡 API Endpoints

### GET /health
Status do servidor

### POST /api/enviar-mensagem
Enviar nova mensagem
```json
{
  "numPedido": "12345",
  "mensagem": "Pedido processado",
  "tipo": "PEDIDO"
}
```

### GET /api/status-fila
Status atual da fila RabbitMQ

### POST /api/reconectar-rabbitmq
Tentar reconectar com RabbitMQ
```json
{
  "success": true,
  "message": "Reconectado com sucesso"
}
```

## 🛠️ Tecnologias Utilizadas

- **Backend**: Node.js, Express, RabbitMQ (amqplib)
- **Frontend**: React 18, Vite, Axios
- **Estilização**: CSS3 com design moderno
- **Desenvolvimento**: ESLint, Nodemon

## 📦 Estrutura do Sistema

O sistema foi organizado em três módulos principais:

1. **`servidor/`** → Backend com API REST e integração RabbitMQ
2. **`produtor/`** → Interface React para envio de mensagens
3. **`consumidor/`** → Interface React para monitoramento de mensagens

## 🔄 Próximos Passos

- [ ] Implementar WebSockets para mensagens em tempo real
- [ ] Adicionar persistência de dados (MongoDB/PostgreSQL)
- [ ] Implementar autenticação e autorização
- [ ] Adicionar testes unitários e integração
- [ ] Deploy com Docker Compose

---

# 🚗 **PROJETO FUTURO: Sistema de Corridas (Tipo Uber)**

## 🎯 **Visão Geral**

Sistema completo de corridas utilizando a base de mensageria já desenvolvida, expandindo para incluir funcionalidades de geolocalização, autenticação, WebSockets e interface moderna para passageiros e motoristas.

## 🏗️ **Arquitetura Planejada**

### **Stack Tecnológica**
- **Backend**: Node.js + Express + MySQL + Socket.io
- **Frontend**: React + Socket.io-client + Axios  
- **Mensageria**: RabbitMQ (sistema atual expandido)
- **Autenticação**: JWT + Google OAuth + bcrypt
- **Geolocalização**: OpenStreetMap + Nominatim API (gratuitas)
- **Deploy**: Docker Compose

### **Estrutura de Filas RabbitMQ**
```
corridas_solicitadas      # Novas solicitações de corrida
corridas_aceitas         # Corridas aceitas pelos motoristas  
status_corrida          # Atualizações de status em tempo real
notificacoes_push       # Notificações gerais do sistema
avaliacoes_pendentes    # Avaliações a serem processadas
```

### **Banco de Dados MySQL**
```sql
-- Tabela de usuários (passageiros e motoristas)
usuarios (
  id, nome, email, senha_hash, tipo, telefone, 
  foto_url, provider, provider_id, created_at, updated_at
)

-- Dados específicos dos motoristas
motoristas (
  user_id, cnh, placa_veiculo, modelo_veiculo, 
  cor_veiculo, disponivel, latitude, longitude, updated_at
)

-- Registro das corridas
corridas (
  id, passageiro_id, motorista_id, origem_lat, origem_lng,
  destino_lat, destino_lng, origem_endereco, destino_endereco,
  status, preco, distancia_km, tempo_estimado, created_at, finished_at
)

-- Sistema de avaliações
avaliacoes (
  id, corrida_id, avaliador_id, avaliado_id, 
  nota, comentario, created_at
)

-- Histórico de posições (para tracking)
posicoes_corrida (
  id, corrida_id, latitude, longitude, timestamp
)
```

## 🛠️ **APIs Gratuitas Integradas**

### **Mapas e Geolocalização**
- **OpenStreetMap**: Mapas base gratuitos
- **Nominatim**: Geocoding (endereço → coordenadas) gratuito
- **OSRM**: Cálculo de rotas e tempo estimado gratuito
- **Leaflet**: Biblioteca JavaScript para mapas interativos

### **Autenticação**
- **Google OAuth 2.0**: Login social gratuito (1M requests/mês)
- **JWT**: Sistema próprio de tokens

## 🚀 **Roadmap de Desenvolvimento (3-4 semanas)**

### **📅 Semana 1: Fundação e Autenticação**
- [x] Configurar MySQL e migrations
- [x] Sistema de autenticação completo (JWT + Google OAuth)
- [x] Estrutura base das APIs (usuários, motoristas)
- [x] Middleware de autenticação e autorização

### **📅 Semana 2: Geolocalização e Core Business**
- [ ] Integração com APIs de mapas (OpenStreetMap + Nominatim)
- [ ] Sistema de corridas (CRUD completo)
- [ ] Cálculo automático de preços e rotas
- [ ] WebSockets básicos para notificações

### **📅 Semana 3: Interfaces e Tempo Real**
- [ ] App do passageiro (solicitar, acompanhar corridas)
- [ ] App do motorista (receber, aceitar, atualizar status)
- [ ] WebSockets avançados para tracking em tempo real
- [ ] Integração com sistema de mensageria existente

### **📅 Semana 4: Funcionalidades Avançadas**
- [ ] Sistema de avaliações bidirecional
- [ ] Histórico completo de corridas
- [ ] Dashboard administrativo (evolução do sistema atual)
- [ ] Testes, otimizações e deployment

## 💡 **Funcionalidades Planejadas**

### **👤 Passageiro**
- ✅ Cadastro/Login (email + senha + Google)
- ✅ Solicitar corrida (origem/destino via mapa ou endereço)
- ✅ Ver motoristas disponíveis no mapa em tempo real
- ✅ Visualizar preço estimado antes de confirmar
- ✅ Acompanhar corrida em tempo real no mapa
- ✅ Chat/comunicação com motorista
- ✅ Avaliar motorista após corrida
- ✅ Histórico completo de corridas
- ✅ Perfil e configurações

### **🚗 Motorista**
- ✅ Cadastro/Login + dados do veículo (CNH, placa, modelo)
- ✅ Toggle disponibilidade (online/offline)
- ✅ Receber notificações de solicitações próximas
- ✅ Aceitar/rejeitar corridas com informações completas
- ✅ Navegação integrada para origem/destino
- ✅ Atualizar status (a caminho, chegou, iniciou, finalizou)
- ✅ Chat/comunicação com passageiro
- ✅ Avaliar passageiro após corrida
- ✅ Histórico e ganhos
- ✅ Perfil e configurações do veículo

### **🔧 Sistema**
- ✅ Cálculo automático de preço por distância/tempo
- ✅ Algoritmo de matching (motorista mais próximo)
- ✅ Notificações push em tempo real
- ✅ Sistema de avaliações com média
- ✅ Dashboard administrativo com métricas
- ✅ Sistema de mensageria para auditoria
- ✅ Geofencing para áreas de atendimento

## 📁 **Estrutura de Projeto Expandida**
```
ride-system/
├── backend/                    # API principal expandida
│   ├── src/
│   │   ├── controllers/        # Lógica de negócio
│   │   │   ├── auth.js        # Autenticação e autorização
│   │   │   ├── users.js       # Gestão de usuários
│   │   │   ├── rides.js       # Sistema de corridas
│   │   │   ├── ratings.js     # Sistema de avaliações
│   │   │   └── geo.js         # Serviços de geolocalização
│   │   ├── models/            # Modelos do banco MySQL
│   │   │   ├── User.js
│   │   │   ├── Driver.js
│   │   │   ├── Ride.js
│   │   │   └── Rating.js
│   │   ├── routes/            # Rotas da API
│   │   ├── middleware/        # Auth, validação, CORS
│   │   ├── services/          # Integração APIs externas
│   │   │   ├── maps.js        # OpenStreetMap/Nominatim
│   │   │   ├── oauth.js       # Google OAuth
│   │   │   └── rabbitmq.js    # Sistema de mensageria
│   │   ├── websockets/        # Socket.io para tempo real
│   │   └── database/          # Migrations e seeds
├── passenger-app/             # App React do passageiro
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── pages/             # Páginas principais
│   │   │   ├── Login.jsx
│   │   │   ├── RequestRide.jsx
│   │   │   ├── TrackRide.jsx
│   │   │   └── History.jsx
│   │   ├── services/          # API calls e WebSocket
│   │   └── hooks/             # Custom hooks React
├── driver-app/                # App React do motorista
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AcceptRide.jsx
│   │   │   └── ActiveRide.jsx
│   │   └── services/
├── admin-dashboard/           # Evolução do sistema atual
│   └── src/                   # Monitoramento + métricas
├── shared/                    # Utilitários compartilhados
│   ├── constants/             # Status, tipos, etc.
│   └── utils/                 # Funções auxiliares
└── docker-compose.yml         # Deploy completo
```

## 🔄 **Fluxos de Negócio Principais**

### **Fluxo de Solicitação de Corrida**
1. Passageiro define origem/destino no mapa
2. Sistema calcula preço e tempo estimado
3. Passageiro confirma → mensagem para `corridas_solicitadas`
4. Motoristas próximos recebem notificação via WebSocket
5. Primeiro motorista aceita → mensagem para `corridas_aceitas`
6. Passageiro notificado via WebSocket
7. Início do tracking em tempo real

### **Fluxo de Execução da Corrida**
1. Motorista atualiza status "A caminho" → `status_corrida`
2. Sistema envia posição em tempo real
3. Motorista atualiza "Chegou no local" → notificação push
4. Motorista atualiza "Corrida iniciada" → tracking ativo
5. Motorista atualiza "Corrida finalizada" → cálculo final
6. Ambos avaliam um ao outro → `avaliacoes_pendentes`

## 🎨 **Design e UX Planejado**

### **App Passageiro**
- **Tela Principal**: Mapa com localização atual
- **Solicitar Corrida**: Busca de endereços + seleção no mapa
- **Aguardando**: Lista de motoristas próximos
- **Em Corrida**: Tracking em tempo real + chat
- **Finalização**: Avaliação + resumo da corrida

### **App Motorista**
- **Dashboard**: Status online/offline + estatísticas
- **Nova Solicitação**: Card com detalhes + aceitar/rejeitar
- **Corrida Ativa**: Navegação + atualizações de status
- **Histórico**: Ganhos + avaliações recebidas

## 🔧 **Configurações Técnicas**

### **Variáveis de Ambiente Expandidas**
```env
# Banco de dados
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ride_system
DB_USER=root
DB_PASSWORD=

# APIs externas
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NOMINATIM_URL=https://nominatim.openstreetmap.org
OSRM_URL=http://router.project-osrm.org

# JWT
JWT_SECRET=
JWT_EXPIRES_IN=7d

# RabbitMQ (existente)
RABBIT_URL=amqp://localhost
```

### **Portas Utilizadas**
- **Backend API**: 3001
- **App Passageiro**: 3000
- **App Motorista**: 3003
- **Admin Dashboard**: 3002 (existente)
- **MySQL**: 3306
- **RabbitMQ**: 5672, 15672

---

**Desenvolvido com ❤️ usando Node.js, React e RabbitMQ**
