import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import {
  idSchema,
  createUserSchema,
  updateUserSchema,
  createOrderSchema,
} from "../validations/schemas.js";

const router = Router();

//Só o admin pode recuperar todos os usuários
// Rota: GET /users
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    return res.json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Ocorreu um erro no servidor. Tente novamente mais tarde.",
    });
  }
});

// Rota: GET /users/id
router.get("/:id", async (req, res) => {
  //Verifica se o id existe
  const id = req.params.id;
  const { success, data: parsedId } = idSchema.safeParse(id);

  if (!success) {
    return res.status(400).json({
      message: "ID do usuário inválido. O ID precisa ser um número inteiro.",
    });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: parsedId } });

    //Verifica se o prisma conseguiu achar o usuário
    if (!user) {
      return res.status(404).json({
        message: `Não foi possível encontrar um usuário com o ID ${parsedId}.`,
      });
    }

    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Ocorreu um erro no servidor. Tente novamente mais tarde.",
    });
  }
});

// Rota: POST /users
router.post("/", async (req, res) => {
  //Verifica se o req.body é do tipo correto (name, lastname, email e password)
  const { success, data: userData } = createUserSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      message: "Dados incorretos ou incompletos",
    });
  }

  try {
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        lastname: userData.lastname,
        email: userData.email,
        password: userData.password,
      },
    });
    return res.status(201).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Ocorreu um erro no servidor. Tente novamente mais tarde.",
    });
  }
});

//Rota: PATCH /users:id
router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  //Verifica se o id existe
  const { success: successId, data: parsedId } = idSchema.safeParse(id);

  if (!successId) {
    return res.status(400).json({
      message: "ID do usuário inválido. O ID precisa ser um número inteiro.",
    });
  }

  //Verifica se o req.body está vazio
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message:
        "Não foi possível atualizar as informações do usuário. Dados incompletos",
    });
  }

  /*Verifica se o req.body é do tipo correto (name, lastname, email e password)
  Todos os dados são opcionais para permitir diferentes tipo de atualizações, 
  mas pelo menos 1 exigido conforme a verificação acima
  */
  const { success: successDataUpdate, data: dataUpdate } =
    updateUserSchema.safeParse(req.body);

  if (!successDataUpdate) {
    return res.status(400).json({
      message:
        "Não foi possível atualizar as informações do usuário. Dados incorretos",
    });
  }

  try {
    const user = await prisma.user.update({
      where: { id: parsedId },
      data: {
        ...(dataUpdate?.name && { name: dataUpdate.name }),
        ...(dataUpdate?.lastname && { lastname: dataUpdate.lastname }),
        ...(dataUpdate?.email && { email: dataUpdate.email }),
        ...(dataUpdate?.password && { password: dataUpdate.password }),
      },
    });

    //Verifica se o prisma conseguiu achar o usuário e atualizar suas informações
    if (!user) {
      return res.status(404).json({
        message: `Não foi possível encontrar um usuário com o ID ${parsedId}.`,
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Ocorreu um erro no servidor. Tente novamente mais tarde.",
    });
  }
});

// Rota: DELETE /users:id
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  //Verifica se o id existe
  const { success, data: parsedId } = idSchema.safeParse(id);

  if (!success) {
    return res.status(400).json({
      message: "ID do usuário inválido. O ID precisa ser um número inteiro.",
    });
  }

  try {
    const userDeleted = await prisma.user.delete({ where: { id: parsedId } });

    //Verifica se o usuário foi encontrado e deletado com sucesso
    if (!userDeleted) {
      return res.status(404).json({
        message: `Não foi possível encontrar um usuário com o ID ${parsedId}.`,
      });
    }

    return res.status(204).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Ocorreu um erro no servidor. Tente novamente mais tarde.",
    });
  }
});

//Rota GET /users:id/orders
router.get("/:id/orders", async (req, res) => {
  const id = req.params.id;

  //Verifica se o id existe
  const { success, data: parsedId } = idSchema.safeParse(id);

  if (!success) {
    return res.status(400).json({
      message: "ID do usuário inválido. O ID precisa ser um número inteiro.",
    });
  }

  try {
    //Traz todos os pedidos do usuário a partir do ID dele
    const userOrders = await prisma.order.findMany({
      where: { userId: parsedId },
      select: {
        id: true,
        total: true,
        user: {
          select: {
            name: true,
            lastname: true,
          },
        },
        orderitem: {
          select: {
            quantity: true,
            product: {
              select: {
                name: true,
                stock: true,
              },
            },
          },
        },
      },
    });

    //Verifica se userOrders é um array vazio
    if (userOrders.length === 0) {
      return res.status(404).json({
        message: `Não foi possível encontrar os pedidos do usuário com o ID ${parsedId}.`,
      });
    }

    res.status(200).json(userOrders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Ocorreu um erro no servidor. Tente novamente mais tarde.",
    });
  }
});

//Rota POST /users:id/order
//Verificar o o id do usuário q fez o pedido e o id do produto
//Trazer os dados do produto e dps dar create em order e orderItem
router.post("/:id/order", async (req, res) => {
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
});
