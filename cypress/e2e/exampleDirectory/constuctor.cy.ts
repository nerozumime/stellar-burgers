import { dataSelectors } from '../cypressSelectors';
import * as ingredientsData from '../../fixtures/ingredients.json';
import * as userData from '../../fixtures/user.json';
import * as orderData from '../../fixtures/order.json';

const ingredients = {
  bun: 'Краторная булка N-200i',
  main: 'Биокотлета из марсианской Магнолии',
  sauce: 'Соус Spicy-X'
};

const PORT = '4000'; // для тестов укажите свой порт

function eventAddIngredient(ingredient: string) {
  cy.contains(ingredient).parent().find('button').click();
}

function constructorContainsIngredients(ingredients: string[]) {
  ingredients.forEach((ingredient) => {
    cy.get(dataSelectors.burgerConstructor).contains(ingredient);
  });
}

function openIngredientModal(ingredient: string) {
  cy.contains(ingredient).click();
}

function closeModal(method: 'button' | 'overlay' = 'button') {
  method === 'button'
    ? cy.get(dataSelectors.modal).find('button').click()
    : cy.get(dataSelectors.modalOverlay).click({ force: true });
}

function isConstructorEmpty() {
  cy.contains('Выберите булки');
  cy.contains('Выберите начинку');
}

beforeEach(() => {
  cy.viewport(1920, 1080);
  cy.intercept('api/ingredients', JSON.stringify(ingredientsData));
  cy.intercept('api/auth/user', JSON.stringify(userData));
  localStorage.setItem('refreshToken', 'refreshToken');
  cy.setCookie('accessToken', 'accessToken');
  cy.visit(`http://localhost:${PORT}/`);
});

afterEach(() => {
  localStorage.removeItem('refreshToken');
  cy.clearCookie('accessToken');
});

describe('Cypress: тесты [burgerConstructor]', () => {
  it('Добавление ингредиента из списка ингредиентов в конструктор', () => {
    eventAddIngredient(ingredients.bun);
    constructorContainsIngredients([ingredients.bun]);
    eventAddIngredient(ingredients.main);
    eventAddIngredient(ingredients.sauce);
    constructorContainsIngredients(Object.values(ingredients));
  });

  it('Открытие и закрытие модального окна с описанием ингредиента, закрытие кнопкой', () => {
    openIngredientModal(ingredients.bun);
    cy.get(dataSelectors.modal);
    closeModal('button');
    cy.get(dataSelectors.modal).should('not.exist');
  });

  it('Открытие и закрытие модального окна с описанием ингредиента, закрытие оверлеем', () => {
    openIngredientModal(ingredients.bun);
    closeModal('overlay');
    cy.get(dataSelectors.modal).should('not.exist');
  });

  it('Отображение в открытом модальном окне данных именно того ингредиента, по которому произошел клик', () => {
    openIngredientModal(ingredients.bun);
    cy.get(dataSelectors.modal).contains(ingredients.bun);
    closeModal('overlay');
  });

  it('Процесс создания заказа', () => {
    eventAddIngredient(ingredients.bun);
    eventAddIngredient(ingredients.main);
    eventAddIngredient(ingredients.sauce);
    constructorContainsIngredients(Object.values(ingredients));

    cy.intercept('POST', 'api/orders', JSON.stringify(orderData));
    cy.contains('Оформить заказ').click();
    cy.get(dataSelectors.modal).contains(orderData.order.number);
    closeModal();
    cy.get(dataSelectors.modal).should('not.exist');
    isConstructorEmpty();
  });
});
