/**
 * @file models.js
 * @description The models for Qeen Analytics SDK.
 */

import { Config, State } from './config.js';
import { AnalyticsEndpointError, InvalidParameterError } from './errors.js';

/**
 * Class that handles page-level analytics.
 * @class PageAnalyticsEvent
 * @param {string} type The type of event (e.g. CLICK, SCROLL, etc.).
 * @param {number} value The value of the event (numeric value, if applicable).
 * @param {string} label The label of the event (e.g. 'ADD_TO_CART').
 * @param {string} domPath The DOM path of the element that triggered the event.
 * @throws {AnalyticsEndpointError} Throws an error if the analytics endpoint is not set.
 * @throws {InvalidParameterError} Throws an error if the user device ID is not set.
 */
export class PageAnalyticsEvent {
  public ts: number = Date.now();
  public pid: string = State.sessionId;
  public u: string = window.location.href;
  public ua: string = navigator.userAgent;
  public r: string = document.referrer;
  public p: string = Config.projectId;
  public csrvid: string = Config.contentServingId;
  public cid: string = Config.contentId;
  public uid: string = State.qeenDeviceId;
  public npdp: boolean = !Config.isPdp;

  public t: string;
  public v: number | null;
  public l: string | null;
  public edp: string | null;

  constructor(type: string, value: number | null, label: string | null, domPath: string | null) {
    this.t = type;
    this.v = value;
    this.l = label;
    this.edp = domPath;

    this.pushEvent();
  }

  /**
   * Push the event to the analytics endpoint.
   * @throws {AnalyticsEndpointError} Throws an error if the analytics endpoint is not set.
   */
  pushEvent(): void {
    if (!Config.analyticsEndpoint) {
      throw new AnalyticsEndpointError('Qeen analytics endpoint not set.');
    }
    if (!State.qeenDeviceId) {
      throw new InvalidParameterError('Qeen user device ID is required.');
    }
    if (window.location.hash.includes('qeen-dev')) {
      console.log(this);
    }

    const payloadObject = {
      event: this
    };
    const payload = JSON.stringify(payloadObject);
    navigator.sendBeacon(Config.analyticsEndpoint, payload);
  }
}

/**
 * Class that handles the parameters for fetching content.
 * @class fetchContentParams
 * @param {string} qeenDeviceId - The Qeen device ID.
 * @property {string} pageUrl - The URL of the page.
 * @property {string} referrerUrl - The URL of the referrer.
 * @property {string} locale - The locale of the user.
 * @property {string} langCode - The language code of the page.
 * @property {string} timezone - The timezone of the user.
 * @property {string} userDeviceId - The Qeen device ID.
 * @property {URLSearchParams} params - The URL search parameters.
 * @method toString - Convert the parameters to a string.
 */
export class fetchContentParams {
  private pageUrl: string = window.location.href;
  private referrerUrl: string = document.referrer;
  private locale: string = navigator.language
  private langCode: string = document.documentElement.lang || 'en';
  private timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
  private userDeviceId: string;

  public params: URLSearchParams;

  constructor(qeenDeviceId: string) {
    this.userDeviceId = qeenDeviceId;

    this.params = new URLSearchParams({
      pageUrl: this.pageUrl,
      userDeviceId: this.userDeviceId,
      referrerUrl: this.referrerUrl,
      locale: this.locale,
      langCode: this.langCode,
      timezone: this.timezone
    });
  }

  /**
   * Convert the parameters to a string.
   * @returns {string} The stringified parameters.
   */
  toString(): string {
    return this.params.toString();
  }
}

/**
 * @interface ContentResponse
 * @property {string} qeenDeviceId - The Qeen device ID.
 * @property {string} analyticsEndpoint - The endpoint for the analytics server.
 * @property {string} projectId - The project ID.
 * @property {string} contentServingId - The content serving ID.
 * @property {string} contentId - The content ID.
 * @property {boolean} isPdp - The product detail page flag.
 * @property {number} idleTime - The idle time in milliseconds.
 * @property {any[]} rawContentSelectors - The raw content selectors.
 * @property {Object} contentSelectors - The content selectors and content.
 */
export interface ContentResponse {
  qeenDeviceId: string;
  analyticsEndpoint: string;
  projectId: string;
  idleTime: number;
  contentServingId: string;
  contentId: string;
  isPdp: boolean;
  rawContentSelectors: any[];
  contentSelectors: Object;
}

/**
 * Structure for interaction events (i.e. clicks, scrolls).
 * @class InteractionEvent
 * @param {string} label - The label of the event.
 * @param {string} value - The selector to bind the event to.
 * @throws {InvalidParameterError} Throws an error if the provided parameters are invalid.
 */
export class InteractionEvent {
  public label: string;
  public value: string;

  constructor(label: string, value: string) {
    if (!label || !value) {
      throw new InvalidParameterError('Label and value are required for interaction events.');
    }
    this.label = label;
    this.value = value;
  }
}
