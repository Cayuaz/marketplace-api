import { Product } from "../../entities/entities.js";
import { productRepository } from "../../repositories/product-repository.js";
// import { productRepository } from "../repositories/product-repository.js";
import { searchSchema, numberSchema } from "../../validations/schemas.js";

const repository = productRepository();

const serverErrorMsg =
  "Ocorreu um erro no servidor. Tente novamente mais tarde.";

const getProductUseCase = async (search: unknown, page: unknown) => {
  //Verifica a query string
  const { data: searchData } = searchSchema.safeParse(search);

  const searchChecked = searchData || "";

  //Verifica o número da página
  const { data: pageData } = numberSchema.safeParse(page);

  const pageSize = 10;

  const pageChecked = pageData || 1;

  try {
    //Retorna os produtos com os nomes que contenham a query string e o total de páginas
    const [products, total] = await repository.getProduct(
      searchChecked,
      pageSize,
      pageChecked
    );

    const newProdutcs = products.map(
      (product) =>
        new Product(
          product.id,
          product.name,
          product.price,
          product.stock,
          product.createdAt
        )
    );

    if (products.length === 0 || !total)
      return {
        success: false,
        status: 404,
        error: "Não foi possível recuperar os produtos e o total de páginas.",
      };

    return {
      success: true,
      status: 200,
      data: { newProdutcs, total: total / pageSize },
    };
  } catch (error) {
    console.log(error);
    return { success: false, status: 500, error: serverErrorMsg };
  }
};

export { getProductUseCase };
