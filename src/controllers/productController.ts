import { type Request, type Response } from "express";
import {
  createProductService,
  deleteProductService,
  getProductByIdService,
  getProductService,
  updateProductService,
} from "../services/productService.js";

//Controla as requisições de GET /products
const getProductController = async (req: Request, res: Response) => {
  const result = await getProductService(req.query.search, req.query.page);

  return result.success
    ? res.status(result.status).json(result.data)
    : res.status(result.status).json(result.error);
};

//Controla as requisições de GET /products/id
const getProductByIdController = async (req: Request, res: Response) => {
  const result = await getProductByIdService(req.params.id);

  return result.success
    ? res.status(result.status).json(result.data)
    : res.status(result.status).json(result.error);
};

//Controla as requisições de POST /products
const createProductController = async (req: Request, res: Response) => {
  const result = await createProductService(req.body);

  return result.success
    ? res.status(result.status).json(result.data)
    : res.status(result.status).json(result.error);
};

//Controla as requisições de PATCH /products/id
const updateProductController = async (req: Request, res: Response) => {
  const result = await updateProductService(req.params.id, req.body);

  return result.success
    ? res.status(result.status).json(result.data)
    : res.status(result.status).json(result.error);
};

//Controla as requisições de DELETE /products/id
const deleteProductController = async (req: Request, res: Response) => {
  const result = await deleteProductService(req.params.id);

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
