import { type Request, type Response } from "express";
import // createProductService,
// deleteProductService,
// getProductByIdService,
// getProductService,
// updateProductService,
"../services/productService.js";
import { createProductUseCase } from "../use-cases/products/create-product.js";
import { getProductUseCase } from "../use-cases/products/get-product.js";
import { getProductByIdUseCase } from "../use-cases/products/get-product-by-id.js";
import { updateProductUseCase } from "../use-cases/products/update-product.js";
import { deleteProductUseCase } from "../use-cases/products/delete-product.js";

//Controla as requisições de GET /products
const getProductController = async (req: Request, res: Response) => {
  const result = await getProductUseCase(req.query.search, req.query.page);

  return result.success
    ? res.status(result.status).json(result.data)
    : res.status(result.status).json(result.error);
};

//Controla as requisições de GET /products/id
const getProductByIdController = async (req: Request, res: Response) => {
  const result = await getProductByIdUseCase(req.params.id);

  return result.success
    ? res.status(result.status).json(result.data)
    : res.status(result.status).json(result.error);
};

//Controla as requisições de POST /products
const createProductController = async (req: Request, res: Response) => {
  const result = await createProductUseCase(req.body);

  return result.success
    ? res.status(result.status).json(result.data)
    : res.status(result.status).json(result.error);
};

//Controla as requisições de PATCH /products/id
const updateProductController = async (req: Request, res: Response) => {
  console.log(req.body);
  const result = await updateProductUseCase(req.params.id, req.body);

  return result.success
    ? res.status(result.status).json(result.data)
    : res.status(result.status).json(result.error);
};

//Controla as requisições de DELETE /products/id
const deleteProductController = async (req: Request, res: Response) => {
  const result = await deleteProductUseCase(req.params.id);

  return result.success
    ? res.status(result.status).end()
    : res.status(result.status).json(result.error);
};

export {
  getProductController,
  getProductByIdController,
  createProductController,
  updateProductController,
  deleteProductController,
};
