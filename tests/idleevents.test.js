const common = require('./common.js');
const puppeteer = require('puppeteer');
let browser;

afterEach(async () => {
  await browser.close();
});

describe('Idle Events', () => {
  it('(Idle User) should observe an IDLE event and different session IDs', async () => {
    browser = await puppeteer.launch();

    const { page, payloads } = await common.setupTest(browser, {
      url: common.pages.productPage,
      endpoint: common.endpoints.pageLevelAnalytics,
      json: true,
      waitForSessionStart: true,
    }, {});

    const sessionId1 = await page.evaluate(() => window.qeen.state.sessionId);

    const idleTime = await page.evaluate(() => window.qeen.config.idleTime);

    await common.wait(idleTime + 50);

    const sessionId2 = await page.evaluate(() => window.qeen.state.sessionId);

    expect(sessionId1).not.toBe(sessionId2);

    const events = common.reduceToEventsArray(payloads);

    expect(events).toContainEqual(expect.objectContaining({ t: 'IDLE' }));
  });

  it('(Active User) should not observe an IDLE event', async () => {
    browser = await puppeteer.launch();

    const { page, payloads } = await common.setupTest(browser, {
      url: common.pages.productPage,
      endpoint: common.endpoints.pageLevelAnalytics,
      json: true,
      waitForSessionStart: true,
    }, {});

    const idleTime = await page.evaluate(() => window.qeen.config.idleTime);

    await common.wait(idleTime / 2);

    await page.mouse.move(0, 0);

    await common.wait(idleTime / 2);

    const events = common.reduceToEventsArray(payloads);
    expect(events).not.toContainEqual(expect.objectContaining({ t: 'IDLE' }));
  });
});