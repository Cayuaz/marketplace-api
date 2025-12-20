import * as z from "zod";

//Schemas de create
const createUserSchema = z.object({
  name: z.string().max(60),
  lastname: z.string().max(150),
  email: z.email(),
  password: z.string().min(5).max(255),
});

const createProductSchema = z.object({
  name: z.string().min(3).max(100),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().positive().int().optional(),
});

//Schemas de update
const updateUserSchema = createUserSchema.partial();
const updateProductSchema = createProductSchema.partial();

const createOrderSchema = z.array(
  z.object({
    productId: z.coerce.number().positive().int(),
    quantity: z.coerce.number().positive().int(),
  })
);

//Schema que converte e verifica os IDs recebidos nas rotas
const numberSchema = z.coerce.number().positive().int();

const searchSchema = z.string().min(1);

export {
  createUserSchema,
  updateUserSchema,
  numberSchema,
  createOrderSchema,
  createProductSchema,
  updateProductSchema,
  searchSchema,
};
