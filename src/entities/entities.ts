import type { Decimal } from "@prisma/client/runtime/client";

class Product {
  constructor(
    public id: number,
    public name: string,
    public price: Decimal,
    public stock: number,
    public createdAt: Date
  ) {}
}

class User {
  constructor(
    public id: number,
    public name: string,
    public lastname: string,
    public email: string,
    public createdAt: Date
  ) {}
}

interface OrderItem {
  quantity: number;
  product: { name: string; stock: number };
}

//Classe que vai criar entidades que representam a lista de pedidos dos usuários
class UserOrders {
  constructor(
    public id: number,
    public total: Decimal,
    public user: { name: string; lastname: string },
    public orderitem: OrderItem[]
  ) {}
}

class Order {
  constructor(
    public createdAt: Date,
    public id: number,
    public total: Decimal,
    public userId: number
  ) {}
}

export { Product, User, UserOrders, Order };
