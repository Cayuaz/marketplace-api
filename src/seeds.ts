// import { Role } from "./generated/prisma/enums.js";
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

  const deleted = await prisma.user.delete({ where: { id: 1 } });
  console.log(deleted);

  const users = await prisma.user.findMany();
  console.log(users);
};

seed();
