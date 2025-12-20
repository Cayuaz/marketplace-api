// import { prisma } from "../lib/prisma.js";
import { type Request, type Response } from "express";

import { getUserUseCase } from "../use-cases/users/get-user.js";
import { getUserByIdUseCase } from "../use-cases/users/get-user-by-id.js";
import { updateUserUseCase } from "../use-cases/users/update-user.js";
import { deleteUserUseCase } from "../use-cases/users/delete-user.js";
import { getUserOrdersUseCase } from "../use-cases/users/get-user-orders.js";
import { createUserOrderUseCase } from "../use-cases/users/create-user-order.js";

//Controla as requisições de GET /users
const getUserController = async (req: Request, res: Response) => {
  const result = await getUserUseCase(req.query.search, req.query.page);

  return result.success
    ? res.status(result.status).json(result.data)
    : res.status(result.status).json(result.error);
};

//Controla as requisições de GET /users/id
const getUserByIdController = async (req: Request, res: Response) => {
  const result = await getUserByIdUseCase(req.params.id);

  return result.success
    ? res.status(result.status).json(result.data)
    : res.status(result.status).json(result.error);
};

//Controla as requisições de PATCH /users:id
const updateUserController = async (req: Request, res: Response) => {
  const result = await updateUserUseCase(req.params.id, req.body);

  return result.success
    ? res.status(result.status).json(result.data)
    : res.status(result.status).json(result.error);
};

//Controla as requisições de DELETE /users:id
const deleteUserController = async (req: Request, res: Response) => {
  const result = await deleteUserUseCase(req.params.id);

  return result.success
    ? res.status(result.status).end()
    : res.status(result.status).json(result.error);
};

//Controla as requisições GET user/id/orders
const getUserOrdersController = async (req: Request, res: Response) => {
  const result = await getUserOrdersUseCase(req.params.id);

  return result.success
    ? res.status(result.status).json(result.data)
    : res.status(result.status).json(result.error);
};

//Controla as requisições POST user/id/order
const createUserOrderController = async (req: Request, res: Response) => {
  const result = await createUserOrderUseCase(req.params.id, req.body);

  return result.success
    ? res.status(result.status).json(result.data)
    : res.status(result.status).json(result.error);
};

export {
  getUserController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  getUserOrdersController,
  createUserOrderController,
};
