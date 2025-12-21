![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

> Uma API RESTful robusta para marketplace, construída com Node.js e TypeScript, focada em arquitetura em camadas, validação de dados e integridade transacional de pedidos.

---

## Índice

- [Sobre](#sobre)
- [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
- [Funcionalidades](#funcionalidades)
- [Objetivos de Aprendizagem](#objetivos-de-aprendizagem)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Executar](#como-executar)
- [Link do Projeto](#link-do-projeto)
- [Licença](#licença)

---

## Sobre

A **Marketplace API** é o back-end de uma aplicação de e-commerce. Ela gerencia todo o fluxo de usuários, produtos e pedidos, garantindo segurança e integridade dos dados.

O projeto foi desenvolvido utilizando **Clean Architecture** (adaptada), separando as responsabilidades em Rotas, Controladores, Casos de Uso (Use Cases) e Repositórios. Isso facilita a manutenção e a escalabilidade. O sistema conta com autenticação JWT, controle de acesso baseado em cargos (RBAC - Admin/User) e um banco de dados relacional PostgreSQL gerenciado pelo Prisma ORM.

---

## Estrutura do Banco de Dados

Ao invés de uma interface gráfica, o "preview" desta API é a modelagem dos dados que sustentam as regras de negócio:

User (1) <---> (N) Order
Order (1) <---> (N) OrderItem
Product (1) <---> (N) OrderItem

**Entidades Principais:**

- **User:** Armazena dados de login e role (ADMIN/USER).
- **Product:** Gerencia nome, preço e controle de estoque.
- **Order:** Registra o total e vincula ao usuário.
- **OrderItem:** Tabela pivô que armazena a quantidade de cada produto em um pedido específico.

---

## Funcionalidades

- **Autenticação e Segurança:**
  - Login e Registro de usuários com criptografia de senha (`bcrypt`).
  - Proteção de rotas via Token JWT (`isLogged`).
  - Controle de Acesso (RBAC): Rotas exclusivas para administradores (`isAdmin`).
- **Gestão de Produtos:**
  - CRUD completo de produtos (Criação, Leitura, Atualização, Deleção).
  - Paginação e Busca: Listagem otimizada com filtros de pesquisa.
- **Sistema de Pedidos Inteligente:**
  - **Transações Atômicas:** Uso do `prisma.$transaction` para garantir que o pedido só seja criado se o estoque for decrementado com sucesso.
  - Validação de Estoque: Impede a venda de itens sem quantidade disponível.
  - Cálculo automático do valor total do pedido no back-end.
- **Validação de Dados:**
  - Uso do `Zod` para garantir que todos os dados de entrada (Body, Params) estejam no formato correto antes de processar a requisição.

---

## Objetivos de Aprendizagem

Este projeto consolidou conhecimentos avançados em desenvolvimento back-end:

- **Arquitetura em Camadas:** Implementação do padrão Repository e Use Case para desacoplar a lógica de negócio do framework (Express) e do banco de dados.
- **Typescript no Back-end:** Tipagem estática rigorosa para Request, Response e objetos de erro, melhorando a segurança do código.
- **Prisma ORM Avançado:**
  - Relacionamentos (One-to-Many, Many-to-Many via tabela pivô).
  - Transações interativas para integridade de dados financeiros/estoque.
- **Middlewares Personalizados:** Criação de middlewares para interceptar requisições e validar tokens JWT e permissões de usuário.
- **Validação com Zod:** Criação de Schemas reutilizáveis para validar criações e atualizações parciais (`partial()`).

---

## Tecnologias Utilizadas

- **Node.js** & **TypeScript**
- **Express** (Servidor Web)
- **Prisma** (ORM)
- **PostgreSQL** (Banco de Dados - NeonDB)
- **Zod** (Validação de Schema)
- **JWT (JsonWebToken)** (Autenticação)
- **Bcrypt** (Hashing de senhas)
- **Cors** & **Dotenv**

---

## Como Executar

O projeto utiliza o gerenciador de pacotes **npm**. Para executá-lo localmente:

1.  Clone este repositório:

    ```bash
    git clone [https://github.com/seu-usuario/marketplace-api.git](https://github.com/seu-usuario/marketplace-api.git)
    ```

2.  Navegue até o diretório do projeto:

    ```bash
    cd marketplace-api
    ```

3.  Instale as dependências:

    ```bash
    npm install
    ```

4.  Configure as variáveis de ambiente:
    Crie um arquivo `.env` na raiz e preencha conforme o exemplo:

    ```env
    DATABASE_URL="postgresql://user:password@host:port/db_name"
    SECRET="sua_chave_secreta_jwt"
    PORT=3000
    ```

5.  Execute as migrações do banco de dados:

    ```bash
    npx prisma migrate dev
    ```

6.  Inicie o servidor de desenvolvimento:

    ```bash
    npm run dev
    ```

---

## Link do Projeto

A API está operante e pode ser testada através do link de deploy:

[https://marketplace-api-du30.onrender.com](https://marketplace-api-du30.onrender.com)

> **Nota:** As rotas `/products` (GET) e `/auth` são públicas. Para testar rotas protegidas, utilize o Postman ou Insomnia para criar um usuário e gerar um token.

---

## Licença

Este projeto está sob a licença MIT. Para mais detalhes, consulte o arquivo [LICENSE](LICENSE).
