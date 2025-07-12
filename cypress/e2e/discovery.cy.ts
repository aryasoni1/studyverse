/// <reference types="cypress" />

describe("Discovery Feature", () => {
  beforeEach(() => {
    cy.visit("/app/discovery");
  });

  it("loads and displays discovery content", () => {
    cy.contains("Discover");
    cy.get('input[placeholder*="Search"]').should("exist");
    cy.contains("Notes");
    cy.contains("Roadmaps");
    cy.contains("Study Rooms");
    cy.contains("Videos").should("not.exist");
  });

  it("switches between tabs", () => {
    cy.get("button").contains("Notes").click();
    cy.contains("Note Library");
    cy.get("button").contains("Roadmaps").click();
    cy.contains("Roadmap Explorer");
    cy.get("button").contains("Study Rooms").click();
    cy.contains("Study Room Explorer");
  });

  it("searches and filters content", () => {
    cy.get('input[placeholder*="Search"]').type("react");
    cy.get("button").contains("Filters").click();
    cy.contains("Topics").parent().contains("react").click();
    cy.contains("Difficulty").parent().contains("beginner").click();
    cy.get("button").contains("Clear Filters").click();
  });

  it("sorts and paginates content", () => {
    cy.get("button").contains("Filters").click();
    cy.contains("Sort by").parent().contains("Popular").click();
    cy.get("button").contains("Filters").click(); // close filters
    cy.contains("Load More").click({ multiple: true, force: true });
  });

  it("shows loading and error states", () => {
    // Simulate network error if possible
    // cy.intercept('GET', '/api/discovery*', { forceNetworkError: true });
    // cy.contains('Failed to search content');
    // For now, just check loading spinner
    cy.get(".animate-spin, .spinner, [role=progressbar]").should("exist");
  });

  it("has no console errors", () => {
    cy.window().then((win) => {
      cy.spy(win.console, "error").as("consoleError");
    });
    cy.reload();
    cy.get("@consoleError").should("not.have.been.called");
  });
});
