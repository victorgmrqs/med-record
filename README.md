# Projeto Med Record

[![codecov](https://codecov.io/gh/victorgmrqs/med-record/branch/main/graph/badge.svg)](https://codecov.io/gh/victorgmrqs/med-record)  
[![DeepSource](https://static.deepsource.io/deepsource-badge-light-mini.svg)](https://deepsource.io/gh/victorgmrqs/med-record/?ref=repository-badge)

---

O **Med Record** é um sistema de prontuário eletrônico para médicos cadastrarem, atualizarem e gerenciarem pacientes, consultas e registros médicos. Ele utiliza princípios de Clean Architecture, Domain-Driven Design e tecnologias como Node.js, Prisma, Fastify e tsyringe.

## Sumário

- [Visão Geral](#visão-geral)
- [Arquitetura e Organização](#arquitetura-e-organização)
- [Instalação e Configuração](#instalação-e-configuração)
- [Execução do Projeto](#execução-do-projeto)
- [Documentação da API](#documentação-da-api)
- [Fluxos Principais](#fluxos-principais)
- [Endpoints e Soft Delete](docs/endpoints.md)
- [Decisões de Modelagem](docs/database.md)
- [Testes](#testes)
- [Contribuições](#contribuições)
- [Licença](#licença)

## Visão Geral

- Cadastro e autenticação de médicos.
- Gerenciamento de informações de pacientes (nome, e-mail, telefone, data de nascimento, sexo, altura e peso).
- Agendamento e registro de consultas, com anotações e prescrições.

## Arquitetura e Organização

O projeto está estruturado em camadas:

- **Adapters:** Comunicação externa (HTTP, banco de dados).
- **Application:** Casos de uso e regras de negócio (use cases).
- **Domain:** Entidades e regras fundamentais.
- **Infra:** Configurações de ambiente e serviços.
- **Middlewares:** Autenticação e outras verificações.
- **Ports:** Interfaces e controllers para a entrada e saída de dados.
- **Repositories:** Acesso aos dados.
- **Shared:** Componentes reutilizáveis e tratamento de erros.

## Instalação e Configuração

1. **Clonar o repositório:**

```bash
git clone https://github.com/seu-usuario/med-record.git
cd med-record
```

2. **Instalar dependências:**

```bash
npm install
```

3. **Configurar variáveis de ambiente:**

```
DATABASE_URL="mysql://root:root@localhost:3310/med_record_db"
NODE_ENV='dev'
APP_PORT=3000
JWT_SECRET=secret
JWT_EXPIRES_IN=3600
JWT_ALGORITHM=HS256
```

4. **Executar migrações:**

```bash
npm run prisma:migrate
```

5. **Iniciar o servidor:**

```bash
npm run dev
```

## Execução do Projeto

### Dockerfile

```bash
docker build -t med-record .
docker run -p 3000:3000 --env-file .env med-record
```

### Docker Compose

```bash
docker-compose up
```

### Docker/DevContainer (VS Code)

1. Abra o projeto no VS Code.
2. Selecione "Reopen in Container".
3. Rode o servidor com:

```bash
npm run dev
```

### Deploy na Cloud

1. Configure variáveis de ambiente no provedor.
2. Execute em modo de produção:

```bash
npm run start
```

## Kubernetes

Os manifestos do Kubernetes podem ser encontrados no diretório `k8s` do projeto.

## Documentação da API

Acesse [http://localhost:3000/docs](http://localhost:3000/docs).

## Fluxos Principais

Para consultar fluxos como cadastro de médico, paciente, agendamento e registros médicos, acesse [Fluxos Principais do Sistema](docs/flows.md).

## Testes

```bash
npm run test
```

### Cobertura de testes

```bash
npm run test:coverage
```

## Contribuições

Contribuições são bem-vindas por meio de pull requests.
