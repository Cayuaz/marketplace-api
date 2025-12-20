import { type Request, type Response } from "express";
import { loginUseCase } from "../use-cases/auth/login.js";
import { registerUseCase } from "../use-cases/auth/register.js";

//Controla as requisições de POST /auth/register
const authRegisterController = async (req: Request, res: Response) => {
  const result = await registerUseCase(req.body);

  return result.success
    ? res.status(result.status).end()
    : res.status(result.status).json(result.error);
};

//Controla as requisições de POST /auth/login
const authLoginController = async (req: Request, res: Response) => {
  const result = await loginUseCase(req.body);

  return result.success
    ? res.status(result.status).json(result.data)
    : res.status(result.status).json(result.error);
};

export { authRegisterController, authLoginController };
