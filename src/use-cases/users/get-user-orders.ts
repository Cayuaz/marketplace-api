import { userRepository } from "../../repositories/user-repository.js";
import { numberSchema } from "../../validations/schemas.js";
import { UserOrders } from "../../entities/entities.js";

const repository = userRepository();

const serverErrorMsg =
  "Ocorreu um erro no servidor. Tente novamente mais tarde.";
const invalidIdMsg =
  "O ID do usuário é inválido. O ID precisa ser um número inteiro.";

const getUserOrdersUseCase = async (id: unknown) => {
  //Verifica se o id existe
  const { success, data: parsedId } = numberSchema.safeParse(id);

  if (!success) return { success: false, status: 400, error: invalidIdMsg };

  try {
    //Traz todos os pedidos do usuário a partir do ID dele
    const userOrders = await repository.getUserOrders(parsedId);

    //Verifica se userOrders é um array vazio
    if (userOrders.length === 0)
      return {
        success: false,
        status: 404,
        error: `Não foi possível encontrar os pedidos do usuário com o ID ${parsedId}.`,
      };

    const newUserOrders = userOrders.map(
      (order) =>
        new UserOrders(order.id, order.total, order.user, order.orderitem)
    );

    return { success: true, status: 200, data: newUserOrders };
  } catch (error) {
    console.log(error);
    return { success: false, status: 500, error: serverErrorMsg };
  }
};

export { getUserOrdersUseCase };
