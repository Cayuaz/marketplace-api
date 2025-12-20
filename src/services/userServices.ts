import { prisma } from "../lib/prisma.js";
import {
  numberSchema,
  createUserSchema,
  updateUserSchema,
  createOrderSchema,
  searchSchema,
} from "../validations/schemas.js";

const serverErrorMsg =
  "Ocorreu um erro no servidor. Tente novamente mais tarde.";
const invalidIdMsg =
  "O ID do usuário é inválido. O ID precisa ser um número inteiro.";
const incompleteDataMSg = "Os dados recebidos estão incorretos ou incompletos.";

//Retorna todos os usuários do banco de dados
const getUserService = async (search: unknown, page: unknown) => {
  //Verifica a query string
  const { data: searchData } = searchSchema.safeParse(search);

  const searchChecked = searchData || "";

  //Verifica o número da página
  const { data: pageData } = numberSchema.safeParse(page);

  const pageSize = 10;

  const pageChecked = pageData || 1;

  try {
    //Retorna os usuários com os nomes que contenham a query string e o total de páginas
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: { name: { contains: searchChecked, mode: "insensitive" } },
        skip: (pageChecked - 1) * pageSize,
        take: pageSize,
      }),
      prisma.user.count({
        where: { name: { contains: searchChecked, mode: "insensitive" } },
      }),
    ]);

    if (users.length === 0 || !total)
      return {
        success: false,
        status: 404,
        error: "Não foi possível recuperar os usuários e o total de páginas.",
      };

    return {
      success: true,
      status: 200,
      data: { users, total: total / pageSize },
    };
  } catch (error) {
    console.log(error);
    return { success: false, status: 500, error: serverErrorMsg };
  }
};

//Retorna um usuário de determinado ID
const getUserByIdService = async (id: unknown) => {
  console.log(id);
  //Verifica se o id existe
  const { success, data: parsedId } = numberSchema.safeParse(id);

  if (!success) return { success: false, status: 400, error: invalidIdMsg };

  try {
    const user = await prisma.user.findUnique({ where: { id: parsedId } });

    //Verifica se o prisma conseguiu achar o usuário
    if (!user)
      return {
        success: false,
        status: 404,
        error: `Não foi possível encontrar o usuário com o ID ${parsedId}.`,
      };

    return { success: true, status: 200, data: user };
  } catch (error) {
    console.log(error);
    return { success: false, status: 500, error: serverErrorMsg };
  }
};

//Cria um novo usuário e retorna ele
const createUserService = async (reqBody: unknown) => {
  //Verifica se o req.body é do tipo correto (name, lastname, email e password)
  const { success, data: userData } = createUserSchema.safeParse(reqBody);

  if (!success)
    return {
      success: false,
      status: 400,
      error: incompleteDataMSg,
    };

  try {
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        lastname: userData.lastname,
        email: userData.email,
        password: userData.password,
      },
    });
    return { success: true, status: 201, data: user };
  } catch (error) {
    console.log(error);
    return { success: false, status: 500, error: serverErrorMsg };
  }
};

//Modifica as informações ou informação de um usuário
const updateUserService = async (id: unknown, reqBody: unknown) => {
  //Verifica se o id existe
  const { success: successId, data: parsedId } = numberSchema.safeParse(id);

  if (!successId) return { success: false, status: 400, error: invalidIdMsg };

  /*Verifica se o req.body é do tipo correto (name, lastname, email e password)
  Todos os dados são opcionais para permitir diferentes tipo de atualizações
  */
  const { success: successDataUpdate, data: dataUpdate } =
    updateUserSchema.safeParse(reqBody);

  if (!successDataUpdate)
    return { success: false, status: 400, error: incompleteDataMSg };

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
    if (!user)
      return {
        success: false,
        status: 404,
        error: `Não foi possível encontrar um usuário com o ID ${parsedId}.`,
      };

    return { success: true, status: 200, data: user };
  } catch (error) {
    console.log(error);
    return { success: false, status: 500, error: serverErrorMsg };
  }
};

//Delete um usuário
const deleteUserService = async (id: unknown) => {
  //Verifica se o id existe
  const { success, data: parsedId } = numberSchema.safeParse(id);

  if (!success) return { success: false, status: 400, error: invalidIdMsg };

  try {
    const userDeleted = await prisma.user.delete({ where: { id: parsedId } });

    //Verifica se o usuário foi encontrado e deletado com sucesso
    if (!userDeleted)
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

//Retorna todos os pedidos de um respectivo usuário
const getOrdersUserService = async (id: unknown) => {
  //Verifica se o id existe
  const { success, data: parsedId } = numberSchema.safeParse(id);

  if (!success) return { success: false, status: 400, error: invalidIdMsg };

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
    if (userOrders.length === 0)
      return {
        success: false,
        status: 404,
        error: `Não foi possível encontrar os pedidos do usuário com o ID ${parsedId}.`,
      };

    return { success: true, status: 200, data: userOrders };
  } catch (error) {
    console.log(error);
    return { success: false, status: 500, error: serverErrorMsg };
  }
};

//Registra novos pedidos e seus respectivos itens
const createUserOrderService = async (id: unknown, reqBody: unknown) => {
  //Verifica se o id existe
  const { success: successId, data: parsedUserId } = numberSchema.safeParse(id);

  if (!successId) return { success: false, status: 400, error: invalidIdMsg };

  //Verifica se o req.body é do tipo correto (productId e quantity)
  const { success: successOrder, data: orderData } =
    createOrderSchema.safeParse(reqBody);

  if (!successOrder)
    return { success: false, status: 400, error: incompleteDataMSg };

  //Array com os IDs dos produtos do pedido
  const productIds = orderData.map((data) => data.productId);

  //Traz os produtos com os IDs recebidos pelo req.body
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  //Compara os IDs de products com os de orderData para encontrar a quantidade correspondente de cada produto comprado
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
    return {
      success: false,
      status: 400,
      error:
        "A quantidade dos produtos não pode ser maior que o estoque disponível.",
    };
  }

  //Calcula o valor total do pedido
  const total = productsWithQuantity.reduce(
    (total, product) => total + product.price.mul(product.quantity).toNumber(),
    0
  );

  //Dados do pedido para serem registrado no banco de dados
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
    if (!order)
      return {
        success: false,
        status: 400,
        error:
          "Não foi possível registrar o pedido. Dados incompletos ou incorretos.",
      };

    return { success: true, status: 201, data: order };
  } catch (error) {
    console.log(error);
    return { success: false, status: 500, error: serverErrorMsg };
  }
};

export {
  getUserService,
  getUserByIdService,
  createUserService,
  updateUserService,
  deleteUserService,
  getOrdersUserService,
  createUserOrderService,
};
