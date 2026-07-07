const SEED = [
  { id: 1, title: 'Finish Cypress Lab', description: 'Create API tests', completed: false },
  { id: 2, title: 'Study Express',      description: 'Review CRUD operations', completed: true  },
];

const seed = () => structuredClone(SEED);

function setup(tasks = seed()) {
  cy.intercept('GET', '/tasks', { statusCode: 200, body: tasks }).as('getTasks');
  cy.visit('/');
  cy.wait('@getTasks');
}

//Prueba de ejemplo
describe('Todo List – Page load', () => {
  it('displays the page title', () => {
    setup();
    cy.get('h1').should('contain', 'Todo List');
  });
});
