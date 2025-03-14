# Fluxos Principais do Sistema

Esta seção apresenta, de forma simples e direta, os principais fluxos de operação do sistema **Med Record**, destacando como médicos, pacientes, agendamentos e registros médicos são gerenciados.

## Fluxo de Criação de Médico

1. **Cadastro e Autenticação:**

   - O médico preenche seus dados (nome, e-mail e senha) para se cadastrar no sistema.
   - Após o cadastro, o médico realiza o login e obtém um token para autenticação nas requisições.

2. **Validações:**

   - O sistema valida o formato do e-mail e exige uma senha com tamanho mínimo.
   - Caso o e-mail já esteja cadastrado, o cadastro é rejeitado.

3. **Armazenamento:**
   - Os dados do médico são salvos no banco de dados e um registro com seu ID é retornado.

## Fluxo de Criação de Paciente

1. **Cadastro do Paciente:**

   - O médico cadastra os dados do paciente, que incluem nome, e-mail, telefone, data de nascimento, sexo, altura, peso e o ID do médico responsável.

2. **Validações:**

   - São validados os dados do paciente (por exemplo, formato de e-mail, data de nascimento no formato correto).
   - Se o paciente já existir ou o médico informado não existir, o cadastro é bloqueado.

3. **Armazenamento:**
   - O paciente é criado no banco de dados e associado ao médico que o cadastrou.

## Fluxo de Agendamento de Consulta

1. **Criação do Agendamento:**

   - O médico agenda uma consulta informando o ID do paciente, seu próprio ID (médico) e a data/hora da consulta.

2. **Validações:**

   - Verifica-se a existência do médico e do paciente.
   - O sistema garante que o horário da consulta esteja entre 7:00 e 19:00.
   - É feita uma verificação para assegurar que o médico não tenha outro agendamento no mesmo intervalo.

3. **Armazenamento:**
   - Se as validações forem bem-sucedidas, o agendamento é salvo e o ID do appointment é retornado.

## Fluxo de Registro Médico (Medical Record)

1. **Criação do Registro:**

   - Durante ou após a consulta, o médico pode registrar observações, diagnóstico, prescrição e outras notas.
   - Esse registro é associado à consulta realizada, preservando o histórico para contabilidade.

2. **Soft Delete e Anonimização:**

   - Mesmo que os dados pessoais do paciente ou do médico sejam "apagados" (soft delete), os registros das consultas permanecem no banco para fins contábeis.
   - No soft delete, os campos sensíveis podem ser atualizados para `null` ou valores padrão, mas o registro da consulta é mantido.

3. **Armazenamento:**
   - O registro médico é salvo no banco e pode ser consultado posteriormente através de consultas específicas.

---

Esses fluxos demonstram como o sistema organiza e valida as principais operações, garantindo a integridade dos dados e o cumprimento dos requisitos funcionais e não funcionais. Para mais detalhes sobre cada operação e suas validações, consulte as seções específicas na documentação.
