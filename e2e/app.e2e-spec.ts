import { MdbTestAngularPage } from './app.po';

describe('mdb-test-angular App', () => {
  let page: MdbTestAngularPage;

  beforeEach(() => {
    page = new MdbTestAngularPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
