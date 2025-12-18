import { Router } from "express";
import { prisma } from "../lib/prisma.js";
const router = Router();
import {
  createProductSchema,
  idSchema,
  updateProductSchema,
} from "../validations/schemas.js";

// Rota: GET /products
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany();

    res.json(products);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Ocorreu um erro no servidor. Tente novamente mais tarde.",
    });
  }
});

// Rota: GET /products:id
router.get("/:id", async (req, res) => {
  //Verifica se o id existe
  const id = req.params.id;
  const { success, data: parsedId } = idSchema.safeParse(id);

  if (!success) {
    return res.status(400).json({
      message: "ID do usuário inválido. O ID precisa ser um número inteiro.",
    });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: parsedId },
    });

    //Verifica se o prisma conseguiu achar o usuário
    if (!product) {
      return res.status(404).json({
        message: `Não foi possível encontrar um usuário com o ID ${parsedId}.`,
      });
    }

    return res.json(product);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Ocorreu um erro no servidor. Tente novamente mais tarde.",
    });
  }
});

// Rota: POST /products
router.post("/", async (req, res) => {
  const { success, data } = createProductSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      message: "Dados incorretos ou incompletos",
    });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        stock: data.stock || 0,
      },
    });
    return res.status(201).json({ product });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Ocorreu um erro no servidor. Tente novamente mais tarde.",
    });
  }
});

//Rota PATCH /products:id
router.patch("/:id", async (req, res) => {
  //Verifica se o id existe
  const id = req.params.id;
  const { success: successId, data: parsedId } = idSchema.safeParse(id);

  if (!successId) {
    return res.status(400).json({
      message: "ID do usuário inválido. O ID precisa ser um número inteiro.",
    });
  }

  //Verifica se o req.body está vazio
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message:
        "Não foi possível atualizar as informações do usuário. Dados incompletos",
    });
  }

  const { success: successDataUpdate, data: dataUpdate } =
    updateProductSchema.safeParse(req.body);

  if (!successDataUpdate) {
    return res.status(400).json({
      message:
        "Não foi possível atualizar as informações do usuário. Dados incorretos",
    });
  }

  try {
    const product = await prisma.product.update({
      where: { id: parsedId },
      data: {
        ...(dataUpdate?.name && { name: dataUpdate.name }),
        ...(dataUpdate?.price && { price: dataUpdate.price }),
        ...(dataUpdate?.stock && { stock: dataUpdate.stock }),
      },
    });

    //Verifica se o prisma conseguiu achar o usuário e atualizar suas informações
    if (!product) {
      return res.status(404).json({
        message: `Não foi possível encontrar um usuário com o ID ${parsedId}.`,
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Ocorreu um erro no servidor. Tente novamente mais tarde.",
    });
  }
});

// Rota: DELETE /products:id
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  //Verifica se o id existe
  const { success, data: parsedId } = idSchema.safeParse(id);

  if (!success) {
    return res.status(400).json({
      message: "ID do usuário inválido. O ID precisa ser um número inteiro.",
    });
  }

  try {
    const productDeleted = await prisma.product.delete({
      where: { id: parsedId },
    });

    //Verifica se o usuário foi encontrado e deletado com sucesso
    if (!productDeleted) {
      return res.status(404).json({
        message: `Não foi possível encontrar um usuário com o ID ${parsedId}.`,
      });
    }

    return res.status(204).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Ocorreu um erro no servidor. Tente novamente mais tarde.",
    });
  }
});
