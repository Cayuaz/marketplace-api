import { prisma } from "../lib/prisma.js";
import type {
  productWithQuantityType,
  updateUserType,
} from "../validations/schemas.js";

const userRepository = () => {
  return {
    /*Retorna todos os usuários do banco de dados
    Skip: é o número de usuários que vão se pulados
    Take: é o limite de usuários retornados em cada response
    Page: é a página atual do site - ex: 1, 2 3
    Se a página é 2 e pageSize 10, skip vai pular 10 usuários, (2 - 1 = 1) * 10 = 10
    */
    getUser: async (
      searchChecked: string,
      pageSize: number,
      pageChecked: number
    ) => {
      //Promise.all permite executar várias operações assíncronas ao mesmo tempo e se uma falhar todas falham, mas não reverte as mudanças feitas
      return await Promise.all([
        prisma.user.findMany({
          where: { name: { contains: searchChecked, mode: "insensitive" } },
          select: {
            id: true,
            name: true,
            lastname: true,
            email: true,
            createdAt: true,
          },
          skip: (pageChecked - 1) * pageSize,
          take: pageSize,
        }),
        prisma.user.count({
          where: { name: { contains: searchChecked, mode: "insensitive" } },
        }),
      ]);
    },
    //Busca um usuário com base no id
    getUserById: async (parsedId: number) => {
      return await prisma.user.findUnique({
        where: { id: parsedId },
        select: {
          id: true,
          name: true,
          lastname: true,
          email: true,
          createdAt: true,
        },
      });
    },
    //Atualiza alguma informação de um determinado usuário
    updateUser: async (parsedId: number, dataUpdate: updateUserType) => {
      return await prisma.user.update({
        where: { id: parsedId },
        data: {
          ...(dataUpdate?.name && { name: dataUpdate.name }),
          ...(dataUpdate?.lastname && { lastname: dataUpdate.lastname }),
          ...(dataUpdate?.email && { email: dataUpdate.email }),
          ...(dataUpdate?.password && { password: dataUpdate.password }),
        },
      });
    },
    //Deleta um usuário
    deleteUser: async (parsedId: number) => {
      return await prisma.user.delete({ where: { id: parsedId } });
    },
    //Retorna todos os pedidos de um usuário
    getUserOrders: async (parsedId: number) => {
      return await prisma.order.findMany({
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
    },
    //Cria um novo pedido
    createUserOrder: async (
      productsWithQuantity: productWithQuantityType[],
      userId: number,
      total: number
    ) => {
      /*transaction é parecido com o Promise.all, mas com a diferença que se alguma das requisições falharem
      todas as outras requisições que já foram concluídas são imediatamente canceladas e revertidas
      */
      return await prisma.$transaction(async (tx) => {
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
            userId: userId,
            total: total,
            orderitem: {
              create: productsWithQuantity.map((product) => ({
                productId: product.id,
                quantity: product.quantity,
              })),
            },
          },
        });
      });
    },
  };
};

export { userRepository };
