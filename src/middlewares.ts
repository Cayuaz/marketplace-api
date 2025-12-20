import { type Request, type Response, type NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

//Verifica se os usuários estão logados com base no token recebido
const isLogged = async (req: Request, res: Response, next: NextFunction) => {
  //Pega a propriedade authorization do headers
  const header = req.headers["authorization"];
  //Pega o token
  const token = header?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Acesso negado. Token inexistente." });
  }

  try {
    //Verifica o token
    jwt.verify(token, process.env.SECRET);

    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Token inválido." });
  }
};

//Verifica se o usuário é um ADMIN
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers["authorization"];
  const token = header?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Acesso negado. Token inexistente." });
  }

  try {
    const userTokenObj = jwt.verify(token, process.env.SECRET) as JwtPayload;

    if (userTokenObj.role && userTokenObj.role === "ADMIN") {
      return next();
    }

    return res
      .status(401)
      .json({ message: "Acesso não autorizado. Rota privada." });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Token inválido." });
  }
};

export { isLogged, isAdmin };
