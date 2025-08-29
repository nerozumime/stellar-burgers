declare namespace Cypress {
  interface Chainable<Subject = any> {
    addIngredient(ingredient: string): Chainable<any>;
    containsIngredients(ingredients: string[]): Chainable<any>;
    makeBurger(ingredients: string[]): Chainable<any>;
    openIngredientModal(ingredient: string): Chainable<any>;
    closeModal(method: 'button' | 'overlay' = 'button'): Chainable<any>;
    isConstructorEmpty(): Chainable<any>;
  }
}
