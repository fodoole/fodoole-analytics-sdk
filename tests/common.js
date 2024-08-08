/**
 * @file Common utility functions for testing.
 * @module common
 * @requires puppeteer
 * @example const common = require('./common.js');
 */

/**
 * List of pages to test.
 * @type {Object}
 */
const pages = {
  productPage: 'http://localhost:30000/product/1',
  productPage2: 'http://localhost:30000/product/2',
  homePage: 'http://localhost:30000/',
  aboutPage: 'http://localhost:30000/about',
  checkoutPage: 'http://localhost:30000/checkout',
};

/**
 * List of event-logging endpoints to intercept.
 * @type {Object}
 */
const endpoints = {
  pageLevelAnalytics: '/log',
};

/**
 * Waits for the content to be served.
 * @param {object} page - The page object from `Puppeteer`.
 * @returns {Promise} A promise that resolves when the content is served.
 */
async function waitForContentServed(page) {
  return page.waitForFunction(() => {
    return window.qeen?.state?.contentServed === true;
  });
};

/**
 * Waits for the page to be fully visible.
 * @param {object} page - The page object from `Puppeteer`.
 * @returns {Promise} A promise that resolves when the page is fully visible.
 */
async function waitForVisibility(page) {
  return page.waitForFunction(() => {
    return document.visibilityState === 'visible' && document.readyState === 'complete';
  });
}

/**
 * Waits for the session to start.
 * @param {object} page - The page object from `Puppeteer`.
 * @returns {Promise} A promise that resolves when the session starts.
 */
async function waitForSessionStart(page) {
  return page.waitForFunction(() => {
    return window.qeen?.state?.sessionId !== undefined && window.qeen?.state?.sessionId !== '';
  });
}

/**
 * Waits for a specified amount of time.
 * @param {number} ms - The amount of time to wait, in milliseconds.
 * @returns {Promise} A promise that resolves after the specified amount of time.
 * @remarks This function can be somewhat unreliable, as it is dependent on the system's load.
 */
async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Reduces an array of payloads to an array of events.
 * @param {Array} payloads - The payloads to reduce.
 * @param {string} [objectName='event'] - The object name to reduce to.
 * @returns {Array} The reduced array of events.
 */
function reduceToEventsArray(payloads, objectName = 'event') {
  return payloads.reduce((acc, curr) => acc.concat(curr[objectName]), []);
}

/**
 * Intercepts requests to a specified endpoint and collects the data.
 * @param {object} page - The page object from `Puppeteer`.
 * @param {string} [endpoint='/log'] - The endpoint to intercept.
 * @param {boolean} [json=true] - Whether to parse the data as JSON.
 * @returns {Array} The collected data.
 */
async function interceptRequests(page, endpoint = '/log', json = true) {
  page.setRequestInterception(true);
  const data = [];
  page.on('request', request => {
    if (request.method() === 'POST' && request.url().includes(endpoint)) {
      const postData = request.postData();
      if (postData) {
        if (json) {
          try {
            const payload = JSON.parse(postData);
            data.push(payload);
          }
          catch (e) {
            console.error(e);
          }
        }
        else {
          data.push(postData);
        }
      }
      else { // Special gtag() case
        // Get everything after ?v= in the URL
        const url = request.url();
        const payload = url.slice(url.indexOf('?v=') + 3);
        data.push(payload);
      }
    }
    request.continue();
  });
  return data;
};

/**
 * Applies a configuration to the page.
 * @param {object} page - The page object from `Puppeteer`.
 * @param {object} config - The configuration to apply.
 * @returns {Promise} A promise that resolves after the configuration is applied.
 * @example applyConfig(page, { config: { idleTime: 1000, gtagIntegrationEnabled: true }, state: { flushBufferTime: 30000 } });
 */
async function applyConfig(page, config) {
  if (!config) return;
  await page.evaluateOnNewDocument((config) => {
    window.qeen = window.qeen || {};

    window.qeen = new Proxy(window.qeen, {
      set: function (target, property, value) {
        if (config[property]) {
          value = { ...value, ...config[property] };
          console.log(`Setting ${property} to ${JSON.stringify(value)}`);
        }
        target[property] = value;
        return true;
      }
    });
  }, config);
}

/**
 * Applies custom getters to the page.
 * @param {object} page - The page object from `Puppeteer`.
 * @param {Array} customGetters - The custom getters to apply.
 * @returns {Promise} A promise that resolves after the custom getters are applied.
 * @example applyCustomGetters(page, [{ obj: 'window', prop: 'myProp', val: 'myVal' }]);
 */
async function applyCustomGetters(page, customGetters) {
  customGetters?.forEach(async (getter) => {
    await page.evaluateOnNewDocument((obj, prop, val) => {
      let parent = window;
      const parts = obj.split('.');
      parts.forEach((part, index) => {
        if (part === 'window' && index === 0) return;
        parent = parent[part];
      });
      Object.defineProperty(parent, prop, {
        get() { return val; },
      });
    }, getter.obj, getter.prop, getter.val);
  });
}

/**
 * Sorts an array of events by the specified parameters.
 * @param {Array} array - The array of events to sort.
 * @param {Array} params - The parameters to sort by.
 * @returns {Array} The sorted array of events.
 */
function sortObjects(array, params) {
  return array.sort((a, b) => {
    for (let param of params) {
      const comparison = a[param].localeCompare(b[param]);
      if (comparison !== 0) return comparison;
    }
    return a.ts - b.ts;
  });
}

/**
 * Sets up a test with the specified configuration.
 * @param {object} browser - The browser object from `Puppeteer`.
 * @param {object} config - The configuration object.
 * @returns {object} The page object and the collected payloads.
 * @remarks The `config` object should have the following properties:
 * - `testTimeout` (number): The timeout for the test, in milliseconds.
 * - `url` (string): The URL to navigate to.
 * - `endpoint` (string): The endpoint to intercept.
 * - `json` (boolean): Whether to parse the data as JSON.
 * - `applyConfig` (object, optional): The qeen.js configuration to apply; should have `config` and `state` properties.
 * - `customGetters` (Array, optional): Custom getters to apply; should have `obj`, `prop`, and `val` properties.
 * - `waitForContentServed` (boolean, optional): Whether to wait for content to be served.
 * - `waitForVisibility` (boolean, optional): Whether to wait for the page to be fully visible.
 * - `waitForSessionStart` (boolean, optional): Whether to wait for the session to start.
 * - `console` (boolean, optional): Whether to pass page console logs to the terminal.
 * @example const { page, payloads } = await setupTest(browser, { url: 'http://localhost:3000', endpoint: '/log', json: true });
 */
async function setupTest(browser, config) {
  // Set the test timeout
  jest.setTimeout(config.testTimeout);

  // Create a new page
  const page = await browser.newPage();

  // Enable console logging
  if (config.console) {
    page.on('console', async msg => {
      for (let i = 0; i < msg.args().length; ++i) {
        try {
          const value = await msg.args()[i].jsonValue();
          console.log(`${i}: ${value}`);
        } catch (error) {
          console.log(`${i}: [CANNOT SERIALISE]`);
        }
      }
    });
  }

  // Apply qeen.js configuration changes
  await applyConfig(page, config.applyConfig);

  // Apply custom getters
  await applyCustomGetters(page, config.customGetters);

  // Intercept network requests
  const payloads = await interceptRequests(page, config.endpoint, config.json);

  // Go to the specified URL
  await page.goto(config.url);

  // Wait for the content to be served
  if (config.waitForContentServed) {
    await waitForContentServed(page);
  }

  // Wait for the page to be fully visible
  if (config.waitForVisibility) {
    await waitForVisibility(page);
  }

  // Wait for the session to start
  if (config.waitForSessionStart) {
    await waitForSessionStart(page);
  }

  return { page, payloads };
}

module.exports = {
  waitForContentServed,
  waitForVisibility,
  waitForSessionStart,
  wait,
  reduceToEventsArray,
  interceptRequests,
  applyConfig,
  sortObjects,
  setupTest,
  pages,
  endpoints,
};
