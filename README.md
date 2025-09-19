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

**Desenvolvido com ❤️ usando Node.js, React e RabbitMQ**

Aplicação Node.js para envio e consumo de mensagens utilizando RabbitMQ.


## Projeto Futuro: Sistema de Notificações para Corridas de Carro (tipo Uber)

### Descrição
Este projeto pode ser expandido para simular um sistema de corridas semelhante ao Uber, utilizando mensageria para comunicação entre passageiros e motoristas.

### Como funcionaria
- Passageiros solicitam corridas (publicam mensagens em uma fila de corridas pendentes).
- Motoristas recebem notificações em tempo real sobre novas solicitações (consomem da fila de corridas pendentes).
- Ao aceitar uma corrida, o motorista publica uma mensagem em uma fila específica do passageiro, notificando-o.
- O sistema pode enviar atualizações de status da corrida (motorista a caminho, chegou, corrida iniciada, finalizada) usando novas mensagens.

### Estrutura sugerida de filas
- `corridas_pendentes`: novas solicitações de corrida.
- `notificacoes_motorista_{id}`: notificações para cada motorista.
- `notificacoes_passageiro_{id}`: notificações para cada passageiro.

### Possíveis extensões
- Persistência das corridas em banco de dados.
- Sistema de avaliação de motoristas e passageiros.
- Simulação de geolocalização.

### Exemplo de fluxo
1. Passageiro solicita corrida → mensagem vai para `corridas_pendentes`.
2. Motoristas recebem a mensagem e um deles aceita.
3. Motorista envia confirmação para `notificacoes_passageiro_{id}`.
4. Passageiro recebe atualização de status conforme a corrida avança.

---

## Pré-requisitos

- Node.js instalado
- Conta RabbitMQ (pode usar [CloudAMQP](https://www.cloudamqp.com/))
- Variáveis de ambiente configuradas (ver `.env_example`)

---

## Instalação

1. Clone o repositório:
    ```sh
    git clone <url-do-repositorio>
    cd Mensageria
    ```

2. Instale as dependências:
    ```sh
    npm install
    ```

3. Configure o arquivo `.env` conforme o exemplo em `.env_example`:
    ```
    RABBIT_URL=<sua_url_rabbitmq>
    QUEUE=notificacoes
    ```

---

## Uso

### Publicar uma notificação

Execute o produtor passando o número do pedido como argumento:

```sh
node producer.js 123
```

Isso enviará uma mensagem para a fila configurada.

### Consumir notificações

Execute o consumidor para receber as mensagens da fila:

```sh
node consumer.js
```

---

## Estrutura dos arquivos

- `producer.js`: Publica mensagens na fila.
- `consumer.js`: Consome mensagens da fila.
- `.env_example`: Exemplo de configuração de ambiente.
- `.env`: Suas configurações de ambiente (NÃO versionar).
- `package.json`: Dependências e scripts do projeto.

---

## Licença

ISC

---

## Autor


[Matheus Mendes dos Santos](https://github.com/M3NT0Sz)

---

**Observação:** Não esqueça de adicionar o arquivo `.env` ao seu `.gitignore` para evitar expor credenciais sensíveis.

    ## O que foi feito neste projeto

    - **Configuração do ambiente Node.js**: O projeto foi iniciado com Node.js, incluindo as dependências `amqplib` (para integração com RabbitMQ) e `dotenv` (para variáveis de ambiente).
    - **Criação do arquivo `.env_example`**: Exemplo de configuração das variáveis de ambiente necessárias para conectar ao RabbitMQ (`RABBIT_URL` e `QUEUE`).
    - **Implementação do produtor (`producer.js`)**:
        - Lê variáveis de ambiente.
        - Recebe o número do pedido via linha de comando.
        - Monta um payload com número do pedido, mensagem e status.
        - Publica a mensagem na fila RabbitMQ configurada.
    - **Implementação do consumidor (`consumer.js`)**:
        - Lê variáveis de ambiente.
        - Conecta à mesma fila RabbitMQ.
        - Consome mensagens da fila, faz o parse do payload e exibe no console.
        - Faz o acknowledge das mensagens processadas.
    - **Documentação**:
        - README com instruções de instalação, configuração, uso e estrutura dos arquivos.
        - Adicionado o link do autor para o GitHub.
    - **Gerenciamento de dependências**:
        - `package.json` configurado com as dependências necessárias.
    - **Boas práticas**:
        - Orientação para não versionar o arquivo `.env`.
        - Sugestão de uso de serviços gratuitos como o CloudAMQP.
        - Licença ISC definida.
