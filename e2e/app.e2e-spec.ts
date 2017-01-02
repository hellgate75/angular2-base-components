import { Angular2BaseComponentsPage } from './app.po';

describe('angular2-base-components App', function() {
  let page: Angular2BaseComponentsPage;

  beforeEach(() => {
    page = new Angular2BaseComponentsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
