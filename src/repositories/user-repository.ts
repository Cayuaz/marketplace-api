import { prisma } from "../lib/prisma.js";
import type {
  productWithQuantityType,
  updateUserType,
} from "../validations/schemas.js";

const userRepository = () => {
  return {
    getUser: async (
      searchChecked: string,
      pageSize: number,
      pageChecked: number
    ) => {
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
    deleteUser: async (parsedId: number) => {
      return await prisma.user.delete({ where: { id: parsedId } });
    },
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
    createUserOrder: async (
      productsWithQuantity: productWithQuantityType[],
      userId: number,
      total: number
    ) => {
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
