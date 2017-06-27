import { QuickstartAngular2Page } from './app.po';

describe('quickstart-angular2 App', () => {
  let page: QuickstartAngular2Page;

  beforeEach(() => {
    page = new QuickstartAngular2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
