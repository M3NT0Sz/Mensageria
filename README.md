# Mensageria

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
