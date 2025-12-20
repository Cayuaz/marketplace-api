import { Router } from "express";
import {
  createUserOrderController,
  deleteUserController,
  getUserOrdersController,
  getUserByIdController,
  getUserController,
  updateUserController,
} from "../controllers/user-controller.js";
import { isAdmin, isLogged } from "../middlewares.js";

const router = Router();

//Só o admin pode recuperar todos os usuários
// Rota: GET /users
router.get("/", isLogged, isAdmin, getUserController);

// Rota: GET /users/id
router.get("/:id", isLogged, getUserByIdController);

//Rota: PATCH /users:id
router.patch("/:id", isLogged, updateUserController);

// Rota: DELETE /users:id
router.delete("/:id", isLogged, deleteUserController);

//Rota GET /users:id/orders
router.get("/:id/orders", isLogged, getUserOrdersController);

//Rota POST /users:id/order

router.post("/:id/order", isLogged, createUserOrderController);

export default router;
