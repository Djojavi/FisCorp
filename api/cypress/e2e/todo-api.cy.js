const BASE = '/tasks';

function createTask(title, description = '', completed = false) {
  return cy
    .request('POST', BASE, { title, description, completed })
    .its('body');
}

function deleteTask(id) {
  return cy.request({ method: 'DELETE', url: `${BASE}/${id}`, failOnStatusCode: false });
}

// Prueba de ejemplo
describe('GET /tasks', () => {
  it('responde con status 200', () => {
    cy.request('GET', BASE).its('status').should('eq', 200);
  });

});
