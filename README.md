## Todo

- [x] Setup Prisma to E2E tests
- [x] Add Swagger
- [ ] Add `Insomnia.json`

## RFs (Requisitos funcionais)

- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [x] Deve ser possível obter o perfil de um usuário logado;
- [x] Deve ser possível listar todas as tarefas de casa
- [x] Deve ser possível adicionar uma nova tarefa de casa
- [ ] Deve ser possível editar uma nova tarefa de casa
- [ ] Deve ser possível excluir uma nova tarefa de casa

## RNs (Regras de negócio)

- [x] O usuário não deve poder se cadastrar com um e-mail duplicado;

## RNFs (Requisitos não-funcionais)

- [x] A senha do usuário precisa estar criptografada;
- [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [x] Todas listas de dados precisam estar paginadas usando cursor-based pagination;
- [x] O usuário deve ser identificado por um JWT (JSON Web Token);