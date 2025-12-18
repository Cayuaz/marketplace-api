import * as z from "zod";

const createUserSchema = z.object({
  name: z.string().max(60),
  lastname: z.string().max(150),
  email: z.email(),
  password: z.string().min(6).max(255),
});

// const updateUserSchema = z.object({
//   name: z.string().max(60).optional(),
//   lastname: z.string().max(150).optional(),
//   email: z.email().optional(),
//   password: z.string().min(6).max(255).optional(),
// });

const updateUserSchema = createUserSchema.partial();

const createOrderSchema = z.array(
  z.object({
    productId: z.coerce.number().positive().int(),
    quantity: z.coerce.number().positive().int(),
  })
);

const idSchema = z.coerce.number().positive().int();
// type user = z.infer<typeof createUserSchema>;

export { createUserSchema, updateUserSchema, idSchema, createOrderSchema };
