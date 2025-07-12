describe('SkillForge App', () => {
  it('should display the landing page', () => {
    cy.visit('/');
    cy.contains('Master Skills, Forge Your Future');
    cy.contains('Start Learning Free');
  });

  it('should navigate to sign up', () => {
    cy.visit('/');
    cy.contains('Start Learning Free').click();
    // Add assertions for sign up page when implemented
  });

  it('should have responsive navigation', () => {
    cy.visit('/');
    cy.viewport(768, 1024);
    // Add mobile navigation tests
  });
});