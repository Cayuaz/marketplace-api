import { prisma } from "../lib/prisma.js";
import type {
  createProductType,
  updateProductType,
} from "../validations/schemas.js";

const productRepository = () => {
  return {
    //Adiciona um novo produto no banco de dados
    createProduct: async (data: createProductType) =>
      await prisma.product.create({
        data: {
          name: data.name,
          price: data.price,
          stock: data.stock || 0,
        },
      }),
    /*Retorna todos os produtos do banco de dados
    Skip: é o número de produtos que vão se pulados
    Take: é o limite de produtos retornados em cada response
    Page: é a página atual do site - ex: 1, 2 3
    Se a página é 2 e pageSize 10, skip vai pular 10 produtos, (2 - 1 = 1) * 10 = 10
    */
    getProduct: async (
      search: string,
      pageSize: number,
      pageNumber: number
    ) => {
      return await Promise.all([
        prisma.product.findMany({
          where: { name: { contains: search, mode: "insensitive" } },
          skip: (pageNumber - 1) * pageSize,
          take: pageSize,
        }),
        prisma.product.count({
          where: { name: { contains: search, mode: "insensitive" } },
        }),
      ]);
    },
    //Busca um produto com base no Id
    getProductById: async (parsedId: number) => {
      return await prisma.product.findUnique({
        where: { id: parsedId },
      });
    },
    //Retorna os produtos de um pedido com base nos Ids desses produtos
    getProductOrder: async (productIds: number[]) => {
      return await prisma.product.findMany({
        where: { id: { in: productIds } },
      });
    },
    //Atualiza alguma informação de um determinado produto
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
    //Deleta um produto
    deleteProduct: async (parsedId: number) => {
      return await prisma.product.delete({
        where: { id: parsedId },
      });
    },
  };
};

export { productRepository };
