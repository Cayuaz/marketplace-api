import { createUserSchema } from "../../validations/schemas.js";
import bcrypt from "bcrypt";
import { authRepository } from "../../repositories/auth-repository.js";

const repository = authRepository();

const serverErrorMsg =
  "Ocorreu um erro no servidor. Tente novamente mais tarde.";
// const invalidIdMsg =
//   "O ID do usuário é inválido. O ID precisa ser um número inteiro.";
const incompleteDataMSg = "Os dados recebidos estão incorretos ou incompletos.";

const registerUseCase = async (reqBody: unknown) => {
  //Verifica se o req.body é do tipo correto (name, lastname, email e password)
  const { success, data: userData } = createUserSchema.safeParse(reqBody);

  if (!success)
    return {
      success: false,
      status: 400,
      error: incompleteDataMSg,
    };

  try {
    //Verifica se já existe um usuário com o email utilizado
    const userWithEmail = await repository.findUserByEmail(userData);

    if (userWithEmail) {
      return {
        success: false,
        status: 400,
        error: "O e-mail utilizado já foi registrado por outro usuário.",
      };
    }

    //O bcrypt.hash criptografa a senha
    const cryptPassword = await bcrypt.hash(userData.password, 12);

    await repository.registerUser(userData, cryptPassword);
    return { success: true, status: 201 };
  } catch (error) {
    console.log(error);
    return { success: false, status: 500, error: serverErrorMsg };
  }
};

export { registerUseCase };
