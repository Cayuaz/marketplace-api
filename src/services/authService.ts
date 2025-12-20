import { createUserSchema, loginSchema } from "../validations/schemas.js";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const serverErrorMsg =
  "Ocorreu um erro no servidor. Tente novamente mais tarde.";
// const invalidIdMsg =
//   "O ID do usuário é inválido. O ID precisa ser um número inteiro.";
const incompleteDataMSg = "Os dados recebidos estão incorretos ou incompletos.";

const authRegisterService = async (reqBody: unknown) => {
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
    const userWithEmail = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (userWithEmail) {
      return {
        success: false,
        status: 400,
        error: "O e-mail utilizado já foi registrado por outro usuário.",
      };
    }

    //O bcrypt.hash criptografa a senha
    const cryptPassword = await bcrypt.hash(userData.password, 12);

    await prisma.user.create({
      data: {
        name: userData.name,
        lastname: userData.lastname,
        email: userData.email,
        password: cryptPassword,
      },
    });
    return { success: true, status: 201 };
  } catch (error) {
    console.log(error);
    return { success: false, status: 500, error: serverErrorMsg };
  }
};

const authLoginService = async (reqBody: unknown) => {
  const { success, data } = loginSchema.safeParse(reqBody);

  if (!success)
    return {
      success: false,
      status: 400,
      error: incompleteDataMSg,
    };

  try {
    const user = await prisma.user.findUnique({ where: { email: data.email } });

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

export { authRegisterService, authLoginService };
