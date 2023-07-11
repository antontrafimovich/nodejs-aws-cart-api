import { CartItem } from '../../cart/models';

export type Order = {
  id?: string;
  userId: string;
  cartId: string;
  items: CartItem[];
  payment: {
    type: string;
    address?: any;
    creditCard?: any;
  };
  delivery: {
    type: string;
    address: any;
  };
  comments: string;
  status: string;
  total: number;
};

export type OrderRemote = {
  id: string;
  user_id: string;
  cart_id: string;
  payment: Record<string, any>;
  delivery: Record<string, any>;
  comments: string;
  status: 'OPEN' | 'ORDERED';
  total: number;
};
