describe('проверяем доступность приложения', function () {
  it('сервис должен быть доступен по адресу localhost:4000', function () {
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:4000');
  });
});
