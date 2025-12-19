import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  getProductByIdController,
  getProductController,
  updateProductController,
} from "../controllers/productController.js";

const router = Router();

// Rota: GET /products
router.get("/", getProductController);

// Rota: GET /products:id
router.get("/:id", getProductByIdController);

// Rota: POST /products
router.post("/", createProductController);

//Rota PATCH /products:id
router.patch("/:id", updateProductController);

// Rota: DELETE /products:id
router.delete("/:id", deleteProductController);

export default router;
