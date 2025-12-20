import { Product } from "../../entities/entities.js";
import { productRepository } from "../../repositories/product-repository.js";
// import { productRepository } from "../repositories/product-repository.js";
import {
  updateProductSchema,
  numberSchema,
} from "../../validations/schemas.js";

const repository = productRepository();

const serverErrorMsg =
  "Ocorreu um erro no servidor. Tente novamente mais tarde.";
const invalidIdMsg =
  "O ID do usuário é inválido. O ID precisa ser um número inteiro.";
const incompleteDataMSg = "Os dados recebidos estão incorretos ou incompletos.";

const updateProductUseCase = async (id: unknown, reqBody: unknown) => {
  // console.log(reqBody);
  //Verifica se o id existe
  const { success: successId, data: parsedId } = numberSchema.safeParse(id);

  if (!successId) return { success: false, status: 400, error: invalidIdMsg };

  /*Verifica se o req.body é do tipo correto (name, price e stock)
  Todos os dados são opcionais para permitir diferentes tipo de atualizações
  */
  const { success: successDataUpdate, data: dataUpdate } =
    updateProductSchema.safeParse(reqBody);

  if (!successDataUpdate)
    return { success: false, status: 400, error: incompleteDataMSg };

  try {
    const product = await repository.updateProduct(parsedId, dataUpdate);

    //Verifica se o prisma conseguiu achar o usuário e atualizar suas informações
    if (!product)
      return {
        success: false,
        status: 404,
        error: `Não foi possível encontrar um usuário com o ID ${parsedId}.`,
      };

    const newProduct = new Product(
      product.id,
      product.name,
      product.price,
      product.stock,
      product.createdAt
    );

    return { success: true, status: 200, data: newProduct };
  } catch (error) {
    console.log(error);
    return { success: false, status: 500, error: serverErrorMsg };
  }
};

export { updateProductUseCase };
