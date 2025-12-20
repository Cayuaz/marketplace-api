import { User } from "../../entities/entities.js";
import { userRepository } from "../../repositories/user-repository.js";
// import { productRepository } from "../repositories/product-repository.js";
import { searchSchema, numberSchema } from "../../validations/schemas.js";

const repository = userRepository();

const serverErrorMsg =
  "Ocorreu um erro no servidor. Tente novamente mais tarde.";

const getUserUseCase = async (search: unknown, page: unknown) => {
  //Verifica a query string
  const { data: searchData } = searchSchema.safeParse(search);

  const searchChecked = searchData || "";

  //Verifica o número da página
  const { data: pageData } = numberSchema.safeParse(page);

  const pageSize = 10;

  const pageChecked = pageData || 1;

  try {
    //Retorna os usuários com os nomes que contenham a query string e o total de páginas
    const [users, total] = await repository.getUser(
      searchChecked,
      pageSize,
      pageChecked
    );

    if (users.length === 0 || !total)
      return {
        success: false,
        status: 404,
        error: "Não foi possível recuperar os usuários e o total de páginas.",
      };

    const newUsers = users.map(
      (user) =>
        new User(user.id, user.name, user.lastname, user.email, user.createdAt)
    );

    return {
      success: true,
      status: 200,
      data: { users: newUsers, total: total / pageSize },
    };
  } catch (error) {
    console.log(error);
    return { success: false, status: 500, error: serverErrorMsg };
  }
};

export { getUserUseCase };
