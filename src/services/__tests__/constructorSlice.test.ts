import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  removeAllIngredients,
  moveUpIngredient,
  moveDownIngredient
} from '../constructorSlice';
import { constructorInitialState } from '../fixture/reducersStates';
import { ingredients } from '../fixture/ingredients';

describe('constructorSlice', () => {
  it('Добавление булки в конструктор бургера', () => {
    const constructorState = constructorReducer(
      constructorInitialState,
      addIngredient(ingredients[0])
    );
    expect(constructorState.constructorItems.bun).toEqual({
      ...ingredients[0],
      id: expect.any(String)
    });
  });

  it('Добавление ингредиентов в конструктор бургера', () => {
    const constructorState = constructorReducer(
      constructorInitialState,
      addIngredient(ingredients[1])
    );
    expect(constructorState.constructorItems.ingredients).toEqual([
      {
        ...ingredients[1],
        id: expect.any(String)
      }
    ]);
    const updatedConstructorState = constructorReducer(
      constructorState,
      addIngredient(ingredients[1])
    );
    expect(updatedConstructorState.constructorItems.ingredients).toHaveLength(
      2
    );
  });

  it('Удаление булки из конструктора бургера должно быть невозможно', () => {
    const constructorState = constructorReducer(
      {
        constructorItems: {
          bun: { ...ingredients[0], id: '1' },
          ingredients: []
        }
      },
      removeIngredient('1')
    );
    expect(constructorState.constructorItems.bun).not.toBeNull();
  });

  it('Удаление ингредиента из конструктора бургера', () => {
    const constructorState = constructorReducer(
      {
        constructorItems: {
          bun: null,
          ingredients: [{ ...ingredients[1], id: '1' }]
        }
      },
      removeIngredient('1')
    );
    expect(constructorState.constructorItems.ingredients.length).toBe(0);
  });

  it('Очистка конструктора бургера, удаление всех ингредиентов', () => {
    const state = {
      constructorItems: {
        bun: { ...ingredients[0], id: '1' },
        ingredients: [
          { ...ingredients[1], id: '2' },
          { ...ingredients[3], id: '3' }
        ]
      }
    };
    const constructorState = constructorReducer(state, removeAllIngredients());
    expect(constructorState.constructorItems.bun).toBeNull();
    expect(constructorState.constructorItems.ingredients).toHaveLength(0);
  });

  it('Перемещение ингредиента вверх', () => {
    const state = {
      constructorItems: {
        bun: null,
        ingredients: [
          { ...ingredients[1], id: '2' },
          { ...ingredients[3], id: '3' }
        ]
      }
    };
    const constructorState = constructorReducer(state, moveUpIngredient(1));
    expect(constructorState.constructorItems.ingredients[0].id).toBe('3');
    expect(constructorState.constructorItems.ingredients[1].id).toBe('2');
  });

  it('Перемещение ингредиента вниз', () => {
    const state = {
      constructorItems: {
        bun: null,
        ingredients: [
          { ...ingredients[1], id: '2' },
          { ...ingredients[3], id: '3' }
        ]
      }
    };
    const constructorState = constructorReducer(state, moveDownIngredient(0));
    expect(constructorState.constructorItems.ingredients[0].id).toBe('3');
    expect(constructorState.constructorItems.ingredients[1].id).toBe('2');
  });
});
