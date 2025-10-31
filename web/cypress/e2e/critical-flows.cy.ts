describe('Fluxos críticos', () => {
  it('exibe formulário de login', () => {
    cy.visit('/login');
    cy.contains('Democracia Direta');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
  });
});
