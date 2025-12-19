import { prisma } from "../lib/prisma.js";
import {
  idSchema,
  createProductSchema,
  updateProductSchema,
} from "../validations/schemas.js";

const serverErrorMsg =
  "Ocorreu um erro no servidor. Tente novamente mais tarde.";
const invalidIdMsg =
  "O ID do usuário é inválido. O ID precisa ser um número inteiro.";
const incompleteDataMSg = "Os dados recebidos estão incorretos ou incompletos.";

//Retorna todos os produtos do banco de dados
const getProductService = async () => {
  try {
    const products = await prisma.product.findMany();

    return { success: true, status: 200, data: products };
  } catch (error) {
    console.log(error);
    return { success: false, status: 500, error: serverErrorMsg };
  }
};

//Retorna um produto de determinado ID
const getProductByIdService = async (id: unknown) => {
  //Verifica se o id existe
  const { success, data: parsedId } = idSchema.safeParse(id);

  if (!success) {
    return { success: false, status: 400, error: invalidIdMsg };
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: parsedId },
    });

    //Verifica se o prisma conseguiu achar o usuário
    if (!product) {
      return {
        success: false,
        status: 404,
        error: `Não foi possível encontrar o usuário com o ID ${parsedId}.`,
      };
    }

    return { success: true, status: 200, data: product };
  } catch (error) {
    console.log(error);
    return { success: false, status: 500, error: serverErrorMsg };
  }
};

//Cria um novo produto e retorna ele
const createProductService = async (reqBody: unknown) => {
  //Verifica se o req.body é do tipo correto (name, price e stock)
  const { success, data } = createProductSchema.safeParse(reqBody);

  if (!success) {
    return { success: false, status: 404, error: incompleteDataMSg };
  }

  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        stock: data.stock || 0,
      },
    });
    return { success: true, status: 201, data: product };
  } catch (error) {
    console.log(error);
    return { success: false, status: 500, error: serverErrorMsg };
  }
};

//Modifica as informações ou informação de um produto
const updateProductService = async (id: unknown, reqBody: unknown) => {
  //Verifica se o id existe
  const { success: successId, data: parsedId } = idSchema.safeParse(id);

  if (!successId) {
    return { success: false, status: 400, error: invalidIdMsg };
  }

  /*Verifica se o req.body é do tipo correto (name, price e stock)
  Todos os dados são opcionais para permitir diferentes tipo de atualizações
  */
  const { success: successDataUpdate, data: dataUpdate } =
    updateProductSchema.safeParse(reqBody);

  if (!successDataUpdate) {
    return { success: false, status: 400, error: incompleteDataMSg };
  }

  try {
    const product = await prisma.product.update({
      where: { id: parsedId },
      data: {
        ...(dataUpdate?.name && { name: dataUpdate.name }),
        ...(dataUpdate?.price && { price: dataUpdate.price }),
        ...(dataUpdate?.stock && { stock: dataUpdate.stock }),
      },
    });

    //Verifica se o prisma conseguiu achar o usuário e atualizar suas informações
    if (!product) {
      return {
        success: false,
        status: 404,
        error: `Não foi possível encontrar um usuário com o ID ${parsedId}.`,
      };
    }

    return { success: true, status: 200, data: product };
  } catch (error) {
    console.log(error);
    return { success: false, status: 500, error: serverErrorMsg };
  }
};

//Deleta um produto
const deleteProductService = async (id: unknown) => {
  //Verifica se o id existe
  const { success, data: parsedId } = idSchema.safeParse(id);

  if (!success) {
    return { success: false, status: 400, error: invalidIdMsg };
  }

  try {
    const productDeleted = await prisma.product.delete({
      where: { id: parsedId },
    });

    //Verifica se o usuário foi encontrado e deletado com sucesso
    if (!productDeleted) {
      return {
        success: false,
        status: 404,
        error: `Não foi possível encontrar um usuário com o ID ${parsedId}.`,
      };
    }

    return { success: true, status: 200 };
  } catch (error) {
    console.log(error);
    return { success: false, status: 500, error: serverErrorMsg };
  }
};

export {
  getProductService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
};
