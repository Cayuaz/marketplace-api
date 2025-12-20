import { Product } from "../../entities/entities.js";
import { productRepository } from "../../repositories/product-repository.js";
// import { productRepository } from "../repositories/product-repository.js";
import { numberSchema } from "../../validations/schemas.js";

const repository = productRepository();

const serverErrorMsg =
  "Ocorreu um erro no servidor. Tente novamente mais tarde.";
const invalidIdMsg =
  "O ID do usuário é inválido. O ID precisa ser um número inteiro.";

const getProductByIdUseCase = async (id: unknown) => {
  //Verifica se o id existe
  const { success, data: parsedId } = numberSchema.safeParse(id);

  if (!success) return { success: false, status: 400, error: invalidIdMsg };

  try {
    const product = await repository.getProductById(parsedId);

    //Verifica se o prisma conseguiu achar o usuário
    if (!product)
      return {
        success: false,
        status: 404,
        error: `Não foi possível encontrar o usuário com o ID ${parsedId}.`,
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

export { getProductByIdUseCase };
