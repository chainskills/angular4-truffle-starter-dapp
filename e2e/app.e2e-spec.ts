import { Angular4TruffleStarterDappPage } from './app.po';

describe('angular4-truffle-starter-dapp App', () => {
  let page: Angular4TruffleStarterDappPage;

  beforeEach(() => {
    page = new Angular4TruffleStarterDappPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
