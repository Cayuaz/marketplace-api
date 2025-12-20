// import { Role } from "./generated/prisma/enums.js";
import { prisma } from "./lib/prisma.js";

const seed = async () => {
  // const user = await prisma.user.create({
  //   data: {
  //     name: "Pedro",
  //     lastname: "Lucas",
  //     role: Role.ADMIN,
  //     email: "pedro@gmail.com",
  //     password: "123",
  //   },
  // });
  // console.log(user);
  // const deleted = await prisma.user.delete({ where: { id: 1 } });
  // console.log(deleted);
  // const users = await prisma.user.findMany();
  // console.log(users);

  const products = await prisma.product.createMany({
    data: [
      { name: "Cadeira Gamer", price: 1299.99, stock: 1 },
      { name: "Mouse", price: 100.0, stock: 2 },
      { name: "Bicicleta", price: 2000.0, stock: 3 },
      { name: "Mesa", price: 1199.99, stock: 4 },
      { name: "Headphone", price: 459.99, stock: 5 },
      { name: "Lego de Pokémon", price: 399.99, stock: 6 },
      { name: "Caderno", price: 49.99, stock: 7 },
      { name: "Kit de pintura", price: 150.0, stock: 8 },
      { name: "Tinta de impressora", price: 139.99, stock: 9 },
      { name: "Calça Jeans Azul", price: 279.99, stock: 10 },
      { name: "Chinelo Havaianas", price: 80.0, stock: 11 },
      { name: "Notebook Acer", price: 4000.0, stock: 12 },
    ],
  });

  console.log(products);
};

seed();
