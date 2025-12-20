import { numberSchema, createOrderSchema } from "../../validations/schemas.js";
import { userRepository } from "../../repositories/user-repository.js";
import { productRepository } from "../../repositories/product-repository.js";
import { Order } from "../../entities/entities.js";

const repository = userRepository();
const productRepo = productRepository();

const serverErrorMsg =
  "Ocorreu um erro no servidor. Tente novamente mais tarde.";
const invalidIdMsg =
  "O ID do usuário é inválido. O ID precisa ser um número inteiro.";
const incompleteDataMSg = "Os dados recebidos estão incorretos ou incompletos.";

const createUserOrderUseCase = async (id: unknown, reqBody: unknown) => {
  //Verifica se o id do usuário existe
  const { success: successId, data: parsedUserId } = numberSchema.safeParse(id);

  if (!successId) return { success: false, status: 400, error: invalidIdMsg };

  //Verifica se o req.body é do tipo correto {productId e quantity}[]
  const { success: successOrder, data: orderData } =
    createOrderSchema.safeParse(reqBody);

  if (!successOrder)
    return { success: false, status: 400, error: incompleteDataMSg };

  //Array com os IDs dos produtos do pedido
  const productIds = orderData.map((data) => data.productId);

  //Traz os produtos com os IDs recebidos pelo req.body
  const products = await productRepo.getProductOrder(productIds);

  //Compara os IDs de products com os de orderData para encontrar a quantidade correspondente de cada produto comprado
  const productsWithQuantity = products.map((product) => {
    const orderInfo = orderData.find((data) => data.productId === product.id);

    //Verifica se a quantidade é um número maior que 0
    if (typeof orderInfo?.quantity !== "number" || orderInfo?.quantity === 0) {
      throw new Error(
        "A quantidade do produto comprado precisa ser maior que zero."
      );
    }

    return {
      ...product,
      quantity: orderInfo.quantity,
    };
  });

  console.log(productsWithQuantity);

  //Verifica se algum produto teve a quantidade de compra maior que o estoque disponível
  const productWithNoStock = productsWithQuantity.find(
    (product) => product.quantity > product.stock
  );

  if (productWithNoStock) {
    return {
      success: false,
      status: 400,
      error: ` ${productWithNoStock.name} está com estoque indisponível.`,
    };
  }

  //Calcula o valor total do pedido
  const total = productsWithQuantity.reduce(
    (total, product) => total + product.price.mul(product.quantity).toNumber(),
    0
  );

  try {
    const order = await repository.createUserOrder(
      productsWithQuantity,
      parsedUserId,
      total
    );

    //Verifica se stock está vazio
    if (!order)
      return {
        success: false,
        status: 400,
        error:
          "Não foi possível registrar o pedido. Dados incompletos ou incorretos.",
      };

    const newOrder = new Order(
      order.createdAt,
      order.id,
      order.total,
      order.userId
    );

    return { success: true, status: 201, data: newOrder };
  } catch (error) {
    console.log(error);
    return { success: false, status: 500, error: serverErrorMsg };
  }
};

export { createUserOrderUseCase };
