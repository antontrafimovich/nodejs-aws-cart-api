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
    user_id: userId,
    cart_id: cartId,
    delivery: rest.delivery,
    payment: rest.payment,
    comments: rest.comments,
    status: rest.status,
    total: rest.total,
  } as OrderRemote;
};
