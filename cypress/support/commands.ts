/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      logout(): Chainable<void>;
      createNote(title: string, content: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/auth/login');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="user-menu"]').click();
  cy.get('[data-testid="logout-button"]').click();
});

Cypress.Commands.add('createNote', (title: string, content: string) => {
  cy.visit('/app/notes');
  cy.get('[data-testid="new-note-button"]').click();
  cy.get('[data-testid="note-title-input"]').type(title);
  cy.get('[data-testid="note-content-textarea"]').type(content);
  cy.get('[data-testid="save-note-button"]').click();
});

export {};