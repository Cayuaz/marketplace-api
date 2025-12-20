import { User } from "../../entities/entities.js";
import { userRepository } from "../../repositories/user-repository.js";
import { updateUserSchema, numberSchema } from "../../validations/schemas.js";

const repository = userRepository();

const serverErrorMsg =
  "Ocorreu um erro no servidor. Tente novamente mais tarde.";
const invalidIdMsg =
  "O ID do usuário é inválido. O ID precisa ser um número inteiro.";
const incompleteDataMSg = "Os dados recebidos estão incorretos ou incompletos.";

const updateUserUseCase = async (id: unknown, reqBody: unknown) => {
  //Verifica se o id existe
  const { success: successId, data: parsedId } = numberSchema.safeParse(id);

  if (!successId) return { success: false, status: 400, error: invalidIdMsg };

  /*Verifica se o req.body é do tipo correto (name, lastname, email e password)
  Todos os dados são opcionais para permitir diferentes tipo de atualizações
  */
  const { success: successDataUpdate, data: dataUpdate } =
    updateUserSchema.safeParse(reqBody);

  if (!successDataUpdate)
    return { success: false, status: 400, error: incompleteDataMSg };

  try {
    const user = await repository.updateUser(parsedId, dataUpdate);

    //Verifica se o prisma conseguiu achar o usuário e atualizar suas informações
    if (!user)
      return {
        success: false,
        status: 404,
        error: `Não foi possível encontrar um usuário com o ID ${parsedId}.`,
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

export { updateUserUseCase };
