import { prisma } from "../lib/prisma.js";
import type { loginType } from "../validations/schemas.js";
import type { createUserType } from "../validations/schemas.js";

const authRepository = () => {
  return {
    //Busca um usuário com base no email
    findUserByEmail: async (data: loginType) => {
      return await prisma.user.findUnique({ where: { email: data.email } });
    },
    //Adiciona um novo usuário no banco de dados
    registerUser: async (userData: createUserType, cryptPassword: string) => {
      return await prisma.user.create({
        data: {
          name: userData.name,
          lastname: userData.lastname,
          email: userData.email,
          password: cryptPassword,
        },
      });
    },
  };
};

export { authRepository };
