import { dataSelectors } from '../cypressSelectors';
import * as ingredientsData from '../../fixtures/ingredients.json';
import * as userData from '../../fixtures/user.json';
import * as orderData from '../../fixtures/order.json';

const ingredients = {
  bun: 'Краторная булка N-200i',
  main: 'Биокотлета из марсианской Магнолии',
  sauce: 'Соус Spicy-X'
};

Cypress.Commands.add('addIngredient', (ingredient: string) => {
  cy.contains(ingredient).parent().find('button').click();
});

Cypress.Commands.add('containsIngredients', (ingredients: string[]) => {
  ingredients.forEach((ingredient) => {
    cy.get(dataSelectors.burgerConstructor).contains(ingredient);
  });
});

Cypress.Commands.add('makeBurger', (ingredients: string[]) => {
  ingredients.forEach((ingredient) => {
    cy.addIngredient(ingredient);
  });
});

Cypress.Commands.add('openIngredientModal', (ingredient: string) => {
  cy.contains(ingredient).click();
});

Cypress.Commands.add(
  'closeModal',
  (method: 'button' | 'overlay' = 'button') => {
    method === 'button'
      ? cy.get(dataSelectors.modal).find(dataSelectors.closeButton).click()
      : cy.get(dataSelectors.modalOverlay).click({ force: true });
  }
);

Cypress.Commands.add('isConstructorEmpty', () => {
  cy.contains('Выберите булки');
  cy.contains('Выберите начинку');
});

beforeEach(() => {
  cy.viewport(1920, 1080);
  cy.intercept('api/ingredients', JSON.stringify(ingredientsData));
  cy.intercept('api/auth/user', JSON.stringify(userData));
  localStorage.setItem('refreshToken', 'refreshToken');
  cy.setCookie('accessToken', 'accessToken');
  cy.visit(`/`);
});

afterEach(() => {
  localStorage.removeItem('refreshToken');
  cy.clearCookie('accessToken');
});

describe('Cypress: тесты [burgerConstructor]', () => {
  it('Добавление ингредиента из списка ингредиентов в конструктор', () => {
    cy.addIngredient(ingredients.bun);
    cy.containsIngredients([ingredients.bun]);
    cy.addIngredient(ingredients.main);
    cy.addIngredient(ingredients.sauce);
    cy.containsIngredients(Object.values(ingredients));
  });

  it('Открытие и закрытие модального окна с описанием ингредиента, закрытие кнопкой', () => {
    cy.openIngredientModal(ingredients.bun);
    cy.get(dataSelectors.modal).as('modal');
    cy.closeModal('button');
    cy.get('@modal').should('not.exist');
  });

  it('Открытие и закрытие модального окна с описанием ингредиента, закрытие оверлеем', () => {
    cy.openIngredientModal(ingredients.bun);
    cy.closeModal('overlay');
    cy.get(dataSelectors.modal).should('not.exist');
  });

  it('Отображение в открытом модальном окне данных именно того ингредиента, по которому произошел клик', () => {
    cy.openIngredientModal(ingredients.bun);
    cy.get(dataSelectors.modal).contains(ingredients.bun);
    cy.closeModal('overlay');
  });

  it('Процесс создания заказа', () => {
    cy.makeBurger(Object.values(ingredients));
    cy.containsIngredients(Object.values(ingredients));
    cy.intercept('POST', 'api/orders', JSON.stringify(orderData));
    cy.contains('Оформить заказ').click();
    cy.get(dataSelectors.modal).as('modal').contains(orderData.order.number);
    cy.closeModal();
    cy.get('@modal').should('not.exist');
    cy.isConstructorEmpty();
  });
});
