import { Product } from "../../entities/entities.js";
import { productRepository } from "../../repositories/product-repository.js";
import { createProductSchema } from "../../validations/schemas.js";

const repository = productRepository();

const serverErrorMsg =
  "Ocorreu um erro no servidor. Tente novamente mais tarde.";

// const invalidIdMsg =

//   "O ID do usuário é inválido. O ID precisa ser um número inteiro.";

const incompleteDataMSg = "Os dados recebidos estão incorretos ou incompletos.";

const createProductUseCase = async (reqBody: unknown) => {
  //Verifica se o req.body é do tipo correto (name, price e stock)
  const { success, data } = createProductSchema.safeParse(reqBody);

  if (!success)
    return { success: false, status: 404, error: incompleteDataMSg };

  try {
    const product = await repository.createProduct(data);

    const newProduct = new Product(
      product.id,
      product.name,
      product.price,
      product.stock,
      product.createdAt
    );

    return { success: true, status: 201, data: newProduct };
  } catch (error) {
    console.log(error);

    return { success: false, status: 500, error: serverErrorMsg };
  }
};

export { createProductUseCase };
