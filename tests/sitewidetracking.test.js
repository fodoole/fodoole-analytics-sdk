const common = require('./common.js');
const puppeteer = require('puppeteer');
let browser;

afterEach(async () => {
  await browser.close();
});

describe('Site-wide Tracking', () => {
  it('(Checkout) should observe a CHECKOUT event with the cart value', async () => {
    browser = await puppeteer.launch();

    const { page, payloads } = await common.setupTest(browser, {
      url: common.pages.checkoutPage,
      endpoint: common.endpoints.pageLevelAnalytics,
      json: true,
      waitForSessionStart: true,
    }, {});

    await page.click('#checkout');
    await common.wait(1_500);

    const events = common.reduceToEventsArray(payloads);
    expect(events).toContainEqual(expect.objectContaining({ t: 'CHECKOUT', v: 1_234.56 }));
  });

  it('(PDP events) should not observe the npdp flag in the event when generating events on a PDP', async () => {
    browser = await puppeteer.launch();

    const { _, payloads } = await common.setupTest(browser, {
      url: common.pages.productPage,
      endpoint: common.endpoints.pageLevelAnalytics,
      json: true,
      waitForSessionStart: true,
    }, {});

    const events = common.reduceToEventsArray(payloads);
    expect(events).toContainEqual(expect.objectContaining({ npdp: false }));
  });

  it('(Page View) should observe PAGE_VIEW but not CONTENT_SERVED on a non-PDP', async () => {
    browser = await puppeteer.launch();

    const { _, payloads } = await common.setupTest(browser, {
      url: common.pages.homePage,
      endpoint: common.endpoints.pageLevelAnalytics,
      json: true,
      waitForSessionStart: true,
    });

    const events = common.reduceToEventsArray(payloads);
    expect(events).toContainEqual(expect.objectContaining({ t: 'PAGE_VIEW' }));
    expect(events).not.toContainEqual(expect.objectContaining({ t: 'CONTENT_SERVED' }));
  });
});