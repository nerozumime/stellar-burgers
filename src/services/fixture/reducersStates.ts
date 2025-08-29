export const ingredientsInitialState = {
  ingredients: [],
  isLoading: false,
  error: null
};
export const constructorInitialState = {
  constructorItems: {
    bun: null,
    ingredients: []
  }
};
export const userInitialState = {
  isAuth: false,
  authStatus: false,
  data: null,
  loginUserError: null,
  loginUserRequest: false,
  registerUserError: null,
  registerUserRequest: false,
  updateUserError: null,
  updateUserRequest: false
};
export const orderInitialState = {
  currentOrder: null,
  orderModalData: null,
  ordersHistory: [],
  orderRequest: false,
  ordersHistoryRequest: false,
  orderError: null
};
export const feedInitialState = {
  orders: [],
  totalOrders: 0,
  ordersToday: 0,
  isLoading: false,
  error: null
};

export const rootInitialState = {
  ingredientsInitialState,
  orderInitialState,
  feedInitialState,
  constructorInitialState,
  userInitialState
};
