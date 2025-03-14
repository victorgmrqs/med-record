# Decisões de Modelagem do Schema do Banco de Dados

O schema foi projetado para atender aos requisitos do sistema de prontuário eletrônico, garantindo integridade, desempenho e flexibilidade para futuras alterações. A seguir, explico as principais decisões de modelagem:

## 1. Entidades e Relacionamentos

- **Doctors**:  
  Cada médico possui um cadastro com informações como nome, e-mail, senha e datas de criação/atualização.  
  **Decisão:**

  - O e-mail é único, garantindo que cada médico seja identificado de forma exclusiva.
  - Foi implementado soft delete, permitindo anonimização dos dados pessoais sem perder o histórico de consultas.

- **Patients**:  
  Os pacientes são cadastrados com informações pessoais (nome, e-mail, telefone, data de nascimento, sexo, altura e peso) e estão associados a um médico.  
  **Decisão:**

  - Cada paciente está vinculado a um médico (relação 1:N), refletindo que um médico é responsável por vários pacientes.
  - O soft delete também foi aplicado aqui, atendendo à LGPD, para que os dados pessoais possam ser removidos, mas o histórico de consultas seja mantido.

- **Appointments**:  
  Os agendamentos de consulta registram a data/hora da consulta e fazem referência tanto ao médico quanto ao paciente.  
  **Decisão:**

  - O relacionamento é feito através de chaves estrangeiras para garantir integridade referencial.
  - Validações no aplicativo asseguram que o agendamento esteja dentro do horário de atendimento e que não haja conflitos.

- **Medical Records**:  
  Os registros médicos são vinculados a uma consulta específica, mantendo anotações, diagnósticos e prescrições realizados durante as consultas.  
  **Decisão:**
  - Os registros médicos não são removidos mesmo que o paciente ou médico sejam "apagados" (soft delete), preservando o histórico para questões contábeis e de auditoria.
  - Esse modelo não segue o CRUD completo, focando na criação e consulta dos registros.

## 2. Soft Delete

- **Motivação:**  
  As novas regras da LGPD exigem que, ao excluir um paciente ou médico, os dados pessoais sejam removidos ou anonimizados, mas o histórico de consultas e registros médicos permaneça para contabilidade e auditoria.

- **Implementação:**
  - Foram adicionados campos como `deleted_at` nas tabelas de **doctors** e **patients**.
  - Em vez de realizar uma exclusão física (DELETE), os endpoints de remoção executam um update que define os campos pessoais (nome, e-mail, senha) como `null` e preenchem o `deleted_at` com a data atual.
  - As consultas que retornam dados (findById, findAll) filtram registros onde `deleted_at` é `null`, garantindo que registros apagados não sejam retornados para operações normais.

## 3. Normalização e Integridade Referencial

- **Chaves Estrangeiras:**
  - Os relacionamentos entre tabelas (ex.: patients -> doctors, appointments -> patients/doctors, medical_records -> appointments) são implementados usando chaves estrangeiras, garantindo que a integridade dos dados seja mantida.
- **Índices e Desempenho:**
  - O uso de índices nas colunas de chave estrangeira ajuda a melhorar o desempenho das consultas e operações de junção (joins) no banco de dados.

## 4. Flexibilidade e Escalabilidade

- **Modularidade:**
  - O schema foi projetado para ser facilmente estendido. Por exemplo, caso seja necessário adicionar novos campos ou entidades, o modelo permite a inclusão sem grandes alterações na estrutura existente.
- **Suporte a Migrações:**
  - A utilização do Prisma como ORM facilita a criação e manutenção das migrações do banco de dados, permitindo evoluções incrementais e seguras do schema.

## 5. Conclusão

Este schema foi elaborado para oferecer um equilíbrio entre conformidade legal (LGPD), integridade dos dados e flexibilidade para futuras evoluções do sistema. As principais escolhas — como a aplicação do soft delete e a definição clara dos relacionamentos — garantem que o sistema seja robusto e escalável, atendendo tanto aos requisitos funcionais quanto aos não funcionais propostos no desafio.

# Diagrama ER do Banco de Dados

![Diagrama ER do Banco de Dados](docs/img/med_record_db.png)
