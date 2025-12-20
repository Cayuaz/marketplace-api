import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  getProductByIdController,
  getProductController,
  updateProductController,
} from "../controllers/product-controller.js";
import { isAdmin, isLogged } from "../middlewares.js";

const router = Router();

// Rota: GET /products
router.get("/", getProductController);

// Rota: GET /products:id
router.get("/:id", getProductByIdController);

// Rota: POST /products
router.post("/", isLogged, isAdmin, createProductController);

//Rota PATCH /products:id
router.patch("/:id", isLogged, isAdmin, updateProductController);

// Rota: DELETE /products:id
router.delete("/:id", isLogged, isAdmin, deleteProductController);

export default router;
