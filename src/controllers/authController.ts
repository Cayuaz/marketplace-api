import { type Request, type Response } from "express";
import { authRegisterService } from "../services/authService.js";

//Controla as requisições de POST /auth/register
const authRegisterController = async (req: Request, res: Response) => {
  const result = await authRegisterService(req.body);

  return result.success
    ? res.status(result.status).json(result.data)
    : res.status(result.status).json(result.error);
};

export { authRegisterController };
