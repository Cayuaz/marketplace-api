//Criar rotas de users e products
//Users - users/id users/id/orders (POST\GET)
//Products - products products/id (só para admin)

import { prisma } from "./lib/prisma.js";
import express from "express";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

try {
  await prisma.$connect();
  console.log("Banco de dados ok");

  app.use("/users", userRouter);
  app.use("/products", productRouter);
  app.listen(port, () => console.log("Server iniciado!"));
} catch (error) {
  console.log(error);
}
