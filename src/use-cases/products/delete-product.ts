import { numberSchema } from "../../validations/schemas.js";

const serverErrorMsg =
  "Ocorreu um erro no servidor. Tente novamente mais tarde.";
const invalidIdMsg =
  "O ID do usuário é inválido. O ID precisa ser um número inteiro.";

import { productRepository } from "../../repositories/product-repository.js";

const repository = productRepository();

const deleteProductUseCase = async (id: unknown) => {
  //Verifica se o id existe
  const { success, data: parsedId } = numberSchema.safeParse(id);

  if (!success) return { success: false, status: 400, error: invalidIdMsg };

  try {
    const productDeleted = await repository.deleteProduct(parsedId);

    //Verifica se o usuário foi encontrado e deletado com sucesso
    if (!productDeleted)
      return {
        success: false,
        status: 404,
        error: `Não foi possível encontrar um usuário com o ID ${parsedId}.`,
      };

    return { success: true, status: 200 };
  } catch (error) {
    console.log(error);
    return { success: false, status: 500, error: serverErrorMsg };
  }
};

export { deleteProductUseCase };
