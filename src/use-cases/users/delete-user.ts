import { userRepository } from "../../repositories/user-repository.js";
import { numberSchema } from "../../validations/schemas.js";

const repository = userRepository();

const serverErrorMsg =
  "Ocorreu um erro no servidor. Tente novamente mais tarde.";
const invalidIdMsg =
  "O ID do usuário é inválido. O ID precisa ser um número inteiro.";

const deleteUserUseCase = async (id: unknown) => {
  //Verifica se o id existe
  const { success, data: parsedId } = numberSchema.safeParse(id);

  if (!success) return { success: false, status: 400, error: invalidIdMsg };

  try {
    const user = await repository.getUserById(parsedId);

    //Verifica se existe um usuário com o ID recebido
    if (!user)
      return {
        success: false,
        status: 404,
        error: `Não foi possível encontrar um usuário com o ID ${parsedId}.`,
      };

    await repository.deleteUser(parsedId);

    return { success: true, status: 200 };
  } catch (error) {
    console.log(error);
    return { success: false, status: 500, error: serverErrorMsg };
  }
};

export { deleteUserUseCase };
