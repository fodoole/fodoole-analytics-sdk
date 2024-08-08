const common = require('./common.js');
const puppeteer = require('puppeteer');
let browser;

afterEach(async () => {
  await browser.close();
});

describe('Tab Change', () => {
  it('(Tab Change Exit) should observe a TAB_SWITCH event', async () => {
    browser = await puppeteer.launch();

    const { _, payloads } = await common.setupTest(browser, {
      url: common.pages.productPage,
      endpoint: common.endpoints.pageLevelAnalytics,
      json: true,
      waitForSessionStart: true,
    }, {});

    const newPage = await browser.newPage();
    await newPage.goto('about:blank');
    await newPage.bringToFront();

    await common.wait(50);

    const events = common.reduceToEventsArray(payloads);
    expect(events).toContainEqual(expect.objectContaining({ t: 'TAB_SWITCH', l: 'EXIT' }));
  });

  it('(Tab Change Exit Return) should observe 2 TAB_SWITCH events', async () => {
    browser = await puppeteer.launch();

    const { page, payloads } = await common.setupTest(browser, {
      url: common.pages.productPage,
      endpoint: common.endpoints.pageLevelAnalytics,
      json: true,
      waitForSessionStart: true,
    }, {});

    const newPage = await browser.newPage();
    await newPage.goto('about:blank');
    await newPage.bringToFront();

    await page.bringToFront();

    await common.wait(50);

    const events = common.reduceToEventsArray(payloads);
    expect(events).toContainEqual(expect.objectContaining({ t: 'TAB_SWITCH', l: 'EXIT' }));
    expect(events).toContainEqual(expect.objectContaining({ t: 'TAB_SWITCH', l: 'RETURN' }));
  });

  it('(Tab Change Idle) should observe a TAB_SWITCH event and see a new session after going idle', async () => {
    browser = await puppeteer.launch();

    const { page, payloads } = await common.setupTest(browser, {
      url: common.pages.productPage,
      endpoint: common.endpoints.pageLevelAnalytics,
      json: true,
      waitForSessionStart: true,
    }, {});

    const sessionId1 = await page.evaluate(() => window.qeen.state.sessionId);

    const newPage = await browser.newPage();
    await newPage.goto('about:blank');
    await newPage.bringToFront();

    const events = common.reduceToEventsArray(payloads);
    expect(events).toContainEqual(expect.objectContaining({ t: 'TAB_SWITCH', l: 'EXIT' }));

    const idleTime = await page.evaluate(() => window.qeen.config.idleTime);

    await common.wait(idleTime + 50);

    payloads.length = 0;

    await page.bringToFront();

    await common.wait(50);

    const sessionId2 = await page.evaluate(() => window.qeen.state.sessionId);

    const events2 = common.reduceToEventsArray(payloads);
    expect(events2).toContainEqual(expect.objectContaining({ t: 'PAGE_VIEW' }));
    expect(sessionId1).not.toBe(sessionId2);
  });

  it('(Tab Change Debounce Flush) should observe a CLICK event when switching tabs', async () => {
    browser = await puppeteer.launch();

    const { page, payloads } = await common.setupTest(browser, {
      url: common.pages.productPage,
      endpoint: common.endpoints.pageLevelAnalytics,
      json: true,
      waitForSessionStart: true,
    }, {});

    const newPage = await browser.newPage();
    await newPage.goto('about:blank');

    await page.bringToFront();
    await page.click('#add-to-cart');
    await newPage.bringToFront();

    await common.wait(50);

    const events = common.reduceToEventsArray(payloads);
    expect(events).toContainEqual(expect.objectContaining({ t: 'CLICK', l: 'ADD_TO_CART' }));
  });
});