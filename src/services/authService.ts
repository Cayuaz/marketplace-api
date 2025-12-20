import { createUserSchema } from "../validations/schemas.js";
import { prisma } from "../lib/prisma.js";

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
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        lastname: userData.lastname,
        email: userData.email,
        password: userData.password,
      },
    });
    return { success: true, status: 201, data: user };
  } catch (error) {
    console.log(error);
    return { success: false, status: 500, error: serverErrorMsg };
  }
};

export { authRegisterService };
