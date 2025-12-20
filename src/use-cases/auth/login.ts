import { loginSchema } from "../../validations/schemas.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authRepository } from "../../repositories/auth-repository.js";

const repository = authRepository();

const serverErrorMsg =
  "Ocorreu um erro no servidor. Tente novamente mais tarde.";
// const invalidIdMsg =
//   "O ID do usuário é inválido. O ID precisa ser um número inteiro.";
const incompleteDataMSg = "Os dados recebidos estão incorretos ou incompletos.";

const loginUseCase = async (reqBody: unknown) => {
  const { success, data } = loginSchema.safeParse(reqBody);

  if (!success)
    return {
      success: false,
      status: 400,
      error: incompleteDataMSg,
    };

  try {
    const user = await repository.findUserByEmail(data);

    if (!user)
      return {
        success: false,
        status: 404,
        error: "Não foi possível encontrar um usuário com o e-mail utilizado.",
      };

    //Compara a senha enviada pelo usuário com a senha criptografada armazenada no banco
    const isPasswordCorrect = bcrypt.compare(data.password, user.password);

    if (!isPasswordCorrect) {
      return {
        success: false,
        status: 400,
        error: "Senha incorreta.",
      };
    }

    //Objeto com id, name, role e token do usuário
    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      process.env.SECRET
    );

    return { success: true, status: 200, data: token };
  } catch (error) {
    console.log(error);
    return { success: false, status: 500, error: serverErrorMsg };
  }
};

export { loginUseCase };
