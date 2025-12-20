import { Router } from "express";
import {
  createUserOrderController,
  deleteUserController,
  getOrdersUserController,
  getUserByIdController,
  getUserController,
  updateUserController,
} from "../controllers/userController.js";

const router = Router();

//Só o admin pode recuperar todos os usuários
// Rota: GET /users
router.get("/", getUserController);

// Rota: GET /users/id
router.get("/:id", getUserByIdController);

//Rota: PATCH /users:id
router.patch("/:id", updateUserController);

// Rota: DELETE /users:id
router.delete("/:id", deleteUserController);

//Rota GET /users:id/orders
router.get("/:id/orders", getOrdersUserController);

//Rota POST /users:id/order

router.post("/:id/order", createUserOrderController);

/*
async (req, res) => {
  const userId = req.params.id;

  //Verifica se o id existe
  const { success: successId, data: parsedUserId } = idSchema.safeParse(userId);

  if (!successId) {
    return res.status(400).json({
      message: "ID do usuário inválido. O ID precisa ser um número inteiro.",
    });
  }

  const { success: successOrder, data: orderData } =
    createOrderSchema.safeParse(req.body);

  if (!successOrder) {
    return res.status(400).json({
      message: "Dados incorretos ou incompletos",
    });
  }

  const productIds = orderData.map((data) => data.productId);

  //Traz os produtos com os IDs recebidos pelo req.body
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  //Encontra a quantidade correspondente a cada produto pelos IDs de orderData e products
  const productsWithQuantity = products.map((product) => {
    const orderInfo = orderData.find((data) => data.productId === product.id);

    return {
      ...product,
      quantity: orderInfo?.quantity as number,
    };
  });

  //Verifica se algum produto teve a quantidade de compra maior que o estoque disponível
  const productWithNoStock = productsWithQuantity.find(
    (product) => product.quantity > product.stock
  );

  if (productWithNoStock) {
    return res.status(400).json({
      message: "ID do usuário inválido. O ID precisa ser um número inteiro.",
    });
  }

  //Cria um objeto com os dados de tipos corretos para registrar o novo pedido no banco de dados
  const total = productsWithQuantity.reduce(
    (total, product) => total + product.price.mul(product.quantity).toNumber(),
    0
  );

  const orderToCreate = {
    userID: parsedUserId,
    total,
  };

  try {
    const order = await prisma.$transaction(async (tx) => {
      //Diminui a quantidade de produtos comprados do estoque de cada produto
      for (const product of productsWithQuantity) {
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: product.quantity } },
        });
      }

      //Cria o pedido e registra os itens dele
      return await tx.order.create({
        data: {
          userId: orderToCreate.userID,
          total,
          orderitem: {
            create: productsWithQuantity.map((product) => ({
              productId: product.id,
              quantity: product.quantity,
            })),
          },
        },
      });
    });

    //Verifica se stock está vazio
    if (!order) {
      return res.status(400).json({
        message:
          "Não foi possível reliazar o pedido. Não foram encontrados produtos com os IDs recebidos.",
      });
    }

    console.log(products);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Ocorreu um erro no servidor. Tente novamente mais tarde.",
    });
  }
})
*/

export default router;
