// import { prisma } from "../lib/prisma.js";
import { type Request, type Response } from "express";
import {
  createUserOrderService,
  createUserService,
  deleteUserService,
  getOrdersUserService,
  getUserByIdService,
  getUserService,
  updateUserService,
} from "../services/userServices.js";

//Controla as requisições de GET /users
const getUserController = async (req: Request, res: Response) => {
  const result = await getUserService(req.query.search, req.query.page);

  return result.success
    ? res.status(result.status).json(result.data)
    : res.status(result.status).json(result.error);
};

//Controla as requisições de GET /users/id
const getUserByIdController = async (req: Request, res: Response) => {
  const result = await getUserByIdService(req.params.id);

  return result.success
    ? res.status(result.status).json(result.data)
    : res.status(result.status).json(result.error);
};

//Controla as requisições de POST /users
const createUserController = async (req: Request, res: Response) => {
  const result = await createUserService(req.body);

  return result.success
    ? res.status(result.status).json(result.data)
    : res.status(result.status).json(result.error);
};

//Controla as requisições de PATCH /users:id
const updateUserController = async (req: Request, res: Response) => {
  const result = await updateUserService(req.params.id, req.body);

  return result.success
    ? res.status(result.status).json(result.data)
    : res.status(result.status).json(result.error);
};

//Controla as requisições de DELETE /users:id
const deleteUserController = async (req: Request, res: Response) => {
  const result = await deleteUserService(req.params.id);

  return result.success
    ? res.status(result.status).end()
    : res.status(result.status).json(result.error);
};

//Controla as requisições GET user/id/orders
const getOrdersUserController = async (req: Request, res: Response) => {
  const result = await getOrdersUserService(req.params.id);

  return result.success
    ? res.status(result.status).json(result.data)
    : res.status(result.status).json(result.error);
};

//Controla as requisições POST user/id/order
const createUserOrderController = async (req: Request, res: Response) => {
  const result = await createUserOrderService(req.params.id, req.body);

  return result.success
    ? res.status(result.status).json(result.data)
    : res.status(result.status).json(result.error);
};

export {
  getUserController,
  getUserByIdController,
  createUserController,
  updateUserController,
  deleteUserController,
  getOrdersUserController,
  createUserOrderController,
};
