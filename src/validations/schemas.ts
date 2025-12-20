import { Decimal } from "@prisma/client/runtime/client";
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

const createOrderSchema = z.array(
  z.object({
    productId: z.coerce.number().positive().int(),
    quantity: z.coerce.number().positive().int(),
  })
);

//Schemas de update
const updateUserSchema = createUserSchema.partial();

const updateProductSchema = createProductSchema.partial();

//Schema de login
const loginSchema = createUserSchema.pick({
  email: true,
  password: true,
});

//Schema que converte um valor para número e verifica se ele é inteiro e positivo
const numberSchema = z.coerce.number().positive().int();

const searchSchema = z.string().min(1);

const productWithQuantity = z.object({
  name: z.string().min(3).max(100),
  price: Decimal,
  stock: z.coerce.number().positive().int().optional(),
  quantity: z.number().positive().int(),
  createdAt: z.date(),
  id: z.number().positive().int(),
});

type createProductType = z.infer<typeof createProductSchema>;
type updateProductType = z.infer<typeof updateProductSchema>;
type loginType = z.infer<typeof loginSchema>;
type createUserType = z.infer<typeof createUserSchema>;
type updateUserType = z.infer<typeof updateUserSchema>;
type productWithQuantityType = z.infer<typeof productWithQuantity>;

export {
  createUserSchema,
  updateUserSchema,
  numberSchema,
  createOrderSchema,
  createProductSchema,
  updateProductSchema,
  searchSchema,
  loginSchema,
  productWithQuantity,
  type createProductType,
  type updateProductType,
  type loginType,
  type createUserType,
  type updateUserType,
  type productWithQuantityType,
};
