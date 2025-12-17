//Criar rotas de users e products
//Users - users/id users/id/orders (POST\GET)
//Products - products products/id (só para admin)

import { prisma } from "./lib/prisma.js";

// console.log("Hello world");

try {
  await prisma.$connect();
  console.log("Banco de dados ok");
} catch (error) {
  console.log(error);
}
