export const selectors = {
  burgerIngredient: 'burger-ingredient',
  burgerConstructor: 'burger-constructor',
  modal: 'modal',
  modalOverlay: 'modal-overlay',
  addButton: 'add-button'
};

export const dataSelectors = {
  burgerIngredient: `[data-cy=${selectors.burgerIngredient}]`,
  burgerConstructor: `[data-cy=${selectors.burgerConstructor}]`,
  modal: `[data-cy=${selectors.modal}]`,
  modalOverlay: `[data-cy=${selectors.modalOverlay}]`,
  addButton: `[data-cy=${selectors.addButton}]`
};
