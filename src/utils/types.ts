export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
};

export type TConstructorIngredient = TIngredient & {
  id: string;
};

export type TOrder = {
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
};

export type TOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TUser = {
  email: string;
  name: string;
};

export type TTabMode = 'bun' | 'sauce' | 'main';

export interface IFormValue {
  name: string;
  email: string;
  password: string;
}

export interface IConstructorState {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
}

export interface IFeedState {
  orders: TOrder[];
  totalOrders: number;
  ordersToday: number;
  isLoading: boolean;
  error: string | null | undefined;
}

export interface IIngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

export interface IUserState {
  isAuth: boolean;
  authStatus: boolean;
  data: TUser | null;
  loginUserError: string | null;
  loginUserRequest: boolean;
  registerUserError: string | null;
  registerUserRequest: boolean;
  updateUserError: string | null;
  updateUserRequest: boolean;
}

export interface IOrderState {
  currentOrder: TOrder | null;
  orderModalData: TOrder | null;
  ordersHistory: TOrder[];
  orderRequest: boolean;
  ordersHistoryRequest: boolean;
  orderError: string | null;
}
