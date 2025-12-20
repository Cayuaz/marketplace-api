import { User } from "../../entities/entities.js";
import { userRepository } from "../../repositories/user-repository.js";
// import { productRepository } from "../repositories/product-repository.js";
import { numberSchema } from "../../validations/schemas.js";

const repository = userRepository();

const serverErrorMsg =
  "Ocorreu um erro no servidor. Tente novamente mais tarde.";
const invalidIdMsg =
  "O ID do usuário é inválido. O ID precisa ser um número inteiro.";

//Retorna todos os usuários do banco de dados
const getUserByIdUseCase = async (id: unknown) => {
  console.log(id);
  //Verifica se o id existe
  const { success, data: parsedId } = numberSchema.safeParse(id);

  if (!success) return { success: false, status: 400, error: invalidIdMsg };

  try {
    const user = await repository.getUserById(parsedId);

    //Verifica se o prisma conseguiu achar o usuário
    if (!user)
      return {
        success: false,
        status: 404,
        error: `Não foi possível encontrar o usuário com o ID ${parsedId}.`,
      };

    const newUser = new User(
      user.id,
      user.name,
      user.lastname,
      user.email,
      user.createdAt
    );

    return { success: true, status: 200, data: newUser };
  } catch (error) {
    console.log(error);
    return { success: false, status: 500, error: serverErrorMsg };
  }
};

export { getUserByIdUseCase };
