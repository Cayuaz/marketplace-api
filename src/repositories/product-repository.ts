import { prisma } from "../lib/prisma.js";
import type {
  createProductType,
  updateProductType,
} from "../validations/schemas.js";

const productRepository = () => {
  return {
    createProduct: async (data: createProductType) =>
      await prisma.product.create({
        data: {
          name: data.name,
          price: data.price,
          stock: data.stock || 0,
        },
      }),
    getProduct: async (
      searchChecked: string,
      pageSize: number,
      pageChecked: number
    ) => {
      return await Promise.all([
        prisma.product.findMany({
          where: { name: { contains: searchChecked, mode: "insensitive" } },
          skip: (pageChecked - 1) * pageSize,
          take: pageSize,
        }),
        prisma.product.count({
          where: { name: { contains: searchChecked, mode: "insensitive" } },
        }),
      ]);
    },
    getProductById: async (parsedId: number) => {
      return await prisma.product.findUnique({
        where: { id: parsedId },
      });
    },
    getProductOrder: async (productIds: number[]) => {
      return await prisma.product.findMany({
        where: { id: { in: productIds } },
      });
    },
    updateProduct: async (parsedId: number, dataUpdate: updateProductType) => {
      return await prisma.product.update({
        where: { id: parsedId },
        data: {
          ...(dataUpdate?.name && { name: dataUpdate.name }),
          ...(dataUpdate?.price && { price: dataUpdate.price }),
          ...(dataUpdate?.stock && { stock: dataUpdate.stock }),
        },
      });
    },
    deleteProduct: async (parsedId: number) => {
      return await prisma.product.delete({
        where: { id: parsedId },
      });
    },
  };
};

export { productRepository };
