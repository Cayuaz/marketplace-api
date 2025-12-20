//Criar rotas de users e products
//Users - users/id users/id/orders (POST\GET)
//Products - products products/id (só para admin)

import { prisma } from "./lib/prisma.js";
import express from "express";
import cors from "cors";
import userRouter from "./routes/user-routes.js";
import productRouter from "./routes/product-routes.js";
import authRouter from "./routes/auth-routes.js";

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

try {
  await prisma.$connect();
  console.log("Banco de dados ok");

  //Routes
  app.use("/users", userRouter);
  app.use("/products", productRouter);
  app.use("/auth", authRouter);
  app.listen(port, () => console.log("Server iniciado!"));
} catch (error) {
  console.log(error);
}
