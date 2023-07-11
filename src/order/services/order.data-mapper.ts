import { Order, OrderRemote } from '../models';

export const mapRemoteToModel = (orderRemote: OrderRemote): Order => {
  const { cart_id, user_id, ...rest } = orderRemote;

  return {
    ...rest,
    userId: user_id,
    cartId: cart_id,
  } as Order;
};

export const mapModelToRemote = (order: Order): OrderRemote => {
  const { cartId, userId, ...rest } = order;

  return {
    ...rest,
    user_id: userId,
    cart_id: cartId,
  } as OrderRemote;
};
