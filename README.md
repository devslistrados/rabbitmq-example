# RabbitMQ Producer and Consumer Examples

## Sobre o Projeto

Este repositório contém exemplos de implementação de um producer e um consumer utilizando RabbitMQ, demonstrados na palestra "Bate Papo Técnico". Estes scripts ajudam a ilustrar como configurar e utilizar filas e trocas de mensagens em um ambiente de desenvolvimento usando Docker e Node.js.

## Pré-Requisitos

- Docker e Docker Compose instalados
- Node.js instalado
- RabbitMQ server configurado (via Docker Compose)


## Configuração do Ambiente

1. **RabbitMQ via Docker Compose**

  O arquivo `docker-compose.yml` configura um servidor RabbitMQ com a interface de gestão habilitada. Para iniciar o servidor, execute:

   ```bash
   docker-compose up -d
   ```

Isso irá subir o RabbitMQ acessível nas portas 5672 para aplicações cliente e 15672 para a interface web de gerenciamento.

2. **Producer**
  
  O script publica mensagens na exchange formulario-ex usando a chave de roteamento integracao. Para executar o producer:

   ```bash
      npm start
   ```


2. **Consumer**

  O script consome mensagens da fila integracao-queue. Para iniciar o consumer, execute:

   ```bash
    npm start
   ```

## Docker Compose

O serviço rabbitmq no docker-compose.yml está configurado com o usuário e senha padrão como root. Ajuste conforme necessário para ambientes de produção.

## Contribuições
Contribuições são sempre bem-vindas. Sinta-se livre para clonar, forkar, reportar issues ou submeter pull requests.

## Licença
Este projeto é distribuído sob a Licença MIT. Veja o arquivo LICENSE para mais detalhes.

## Contato
Matheus Silva - devmosilva@gmail.com
