import Cypress from 'cypress';

const API = {
  baseUrl: 'https://norma.nomoreparties.space/api',
  endpoints: {
    ingredients: '/ingredients',
    auth: {
      login: '/auth/login',
      user: '/auth/user'
    },
    orders: '/orders'
  }
};


const ELEMENTS = {
  ingredients: {
    mainBun: `[data-cy=${'643d69a5c3f7b9001cfa093c'}]`,
    specialBun: `[data-cy=${'643d69a5c3f7b9001cfa093d'}]`,
    mainIngredient: `[data-cy=${'643d69a5c3f7b9001cfa093f'}]`,
    sauce: `[data-cy=${'643d69a5c3f7b9001cfa0945'}]`
  },
  controls: {
    orderBtn: '[data-cy="order-button"]',
    overlayArea: '[data-cy="overlay"]'
  },
  modal: '#modals'
};

const setupEnvironment = () => {
  const { baseUrl, endpoints } = API;

  cy.intercept('GET', `${baseUrl}${endpoints.ingredients}`, { fixture: 'ingredients.json' });
  cy.intercept('POST', `${baseUrl}${endpoints.auth.login}`, { fixture: 'user.json' });
  cy.intercept('GET', `${baseUrl}${endpoints.auth.user}`, { fixture: 'user.json' });
  cy.intercept('POST', `${baseUrl}${endpoints.orders}`, { fixture: 'orderResponse.json' });

  cy.visit('/');
  cy.viewport(1440, 800);
  cy.get(ELEMENTS.modal).as('modalWindow');
};

describe('Система сборки космических бургеров', () => {
  beforeEach(setupEnvironment);

  describe('Операции с ингредиентами', () => {
    it('проверяет добавление ингредиента', () => {
      cy.get(ELEMENTS.ingredients.mainIngredient).children('button').click();
      cy.get(ELEMENTS.ingredients.mainIngredient).find('.counter__num').contains('1');
    });

    describe('Последовательности сборки', () => {
      const assemblySteps = {
        bunThenIngredient: () => {
          cy.get(ELEMENTS.ingredients.mainBun).children('button').click();
          cy.get(ELEMENTS.ingredients.mainIngredient).children('button').click();
        },
        ingredientThenBun: () => {
          cy.get(ELEMENTS.ingredients.mainIngredient).children('button').click();
          cy.get(ELEMENTS.ingredients.mainBun).children('button').click();
        }
      };

      it('выполняет сборку начиная с булки', assemblySteps.bunThenIngredient);
      it('выполняет сборку начиная с начинки', assemblySteps.ingredientThenBun);
    });

    describe('Операции с булками', () => {
      it('выполняет замену булки в пустом конструкторе', () => {
        cy.get(ELEMENTS.ingredients.mainBun).children('button').click();
        cy.get(ELEMENTS.ingredients.specialBun).children('button').click();
      });

      it('выполняет замену булки с начинкой', () => {
        cy.get(ELEMENTS.ingredients.mainBun).children('button').click();
        cy.get(ELEMENTS.ingredients.mainIngredient).children('button').click();
        cy.get(ELEMENTS.ingredients.specialBun).children('button').click();
      });
    });
  });

  describe('Операции с заказом', () => {
    const handleAuth = {
      initialize: () => {
        window.localStorage.setItem('refreshToken', 'ipsum');
        cy.setCookie('accessToken', 'lorem');
        cy.getAllLocalStorage().should('be.not.empty');
        cy.getCookie('accessToken').should('be.not.empty');
      },
      cleanup: () => {
        window.localStorage.clear();
        cy.clearAllCookies();
        cy.getAllLocalStorage().should('be.empty');
        cy.getAllCookies().should('be.empty');
      }
    };

    beforeEach(handleAuth.initialize);
    afterEach(handleAuth.cleanup);

    it('выполняет оформление заказа', () => {
      cy.get(ELEMENTS.ingredients.mainBun).children('button').click();
      cy.get(ELEMENTS.ingredients.mainIngredient).children('button').click();
      cy.get(ELEMENTS.controls.orderBtn).click();
      cy.get('@modalWindow').find('h2').contains('38483');
    });
  });

  describe('Операции с модальными окнами', () => {
    const dialogActions = [
      {
        description: 'показывает информацию об ингредиенте',
        execute: () => {
          cy.get(ELEMENTS.ingredients.mainIngredient).find('a').click();
          cy.url().should('include', '643d69a5c3f7b9001cfa093f');
        }
      },
      {
        description: 'закрывает окно кнопкой',
        execute: () => {
          cy.get(ELEMENTS.ingredients.mainIngredient).find('a').click();
          cy.get('@modalWindow').find('button').click();
        }
      },
      {
        description: 'закрывает окно кликом по оверлею',
        execute: () => {
          cy.get(ELEMENTS.ingredients.mainIngredient).find('a').click();
          cy.get(ELEMENTS.controls.overlayArea).click({ force: true });
        }
      },
      {
        description: 'закрывает окно по клавише Escape',
        execute: () => {
          cy.get(ELEMENTS.ingredients.mainIngredient).find('a').click();
          cy.get('body').trigger('keydown', { key: 'Escape' });
        }
      }
    ];

    beforeEach(() => {
      cy.get('@modalWindow').should('be.empty');
    });

    dialogActions.forEach(({ description, execute }) => {
      it(description, () => {
        execute();
        if (description !== 'показывает информацию об ингредиенте') {
          cy.get('@modalWindow').should('be.empty');
        } else {
          cy.get('@modalWindow').should('be.not.empty');
        }
      });
    });
  });
});
