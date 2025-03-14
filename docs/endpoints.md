## Endpoints e Soft Delete

A API implementa um CRUD completo para as seguintes entidades:

- **Doctors**: Permite criar, ler, atualizar e (soft) deletar registros de médicos.
- **Patients**: Permite criar, ler, atualizar e (soft) deletar registros de pacientes.
- **Appointments**: Permite criar, ler, atualizar e excluir agendamentos de consulta.

**Exceção:**

- **Medical Records**: Os endpoints de registros médicos não seguem um CRUD completo. Eles possibilitam a criação e a consulta dos registros, mantendo o histórico das consultas para fins contábeis.

### Soft Delete nas Entidades Doctor e Patient

Para atender às novas regras da LGPD e preservar o histórico contábil:

- Os endpoints de delete para **Doctors** e **Patients** não removem fisicamente os registros do banco de dados.
- Em vez disso, é implementado um _soft delete_: os dados pessoais (como nome, e-mail e senha) são atualizados para `null` e o campo `deleted_at` é preenchido com a data da exclusão.
- Dessa forma, o sistema trata esses registros como inexistentes para operações de atualização e leitura (retornando 404), mas mantém o histórico das consultas e demais registros associados.

Essa abordagem garante a integridade dos dados e a conformidade com as novas regras de proteção de dados, sem comprometer o histórico necessário para a contabilidade.
