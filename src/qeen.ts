/**
 * @file qeen.ts
 * @description The main script for Qeen Analytics SDK.
 */

import { fetchContent, initPageSession } from './sessionManager';
import { Config, State } from './config';
import { bindClickEvents, bindScrollEvents, sendCheckoutEvent } from './pageEvents';
import { randInt } from './utils';
import { InteractionEvent } from './models';
import { receiveMessage } from './demoMode';
import { InvalidParameterError, AnalyticsEndpointError, ResponseNotOkError, URLContainsNoQeenError } from './errors';

declare global {
  interface Window {
    qeen: any;
    qeenError: string;
  }
}

/**
 * @namespace qeen
 * @description The main namespace for the Qeen Analytics SDK.
 */
window.qeen = window.qeen || {};

window.qeen.fetchQeenContent = fetchContent;
window.qeen.initPageSession = initPageSession;
window.qeen.bindClickEvents = bindClickEvents;
window.qeen.bindScrollEvents = bindScrollEvents;
window.qeen.sendCheckoutEvent = sendCheckoutEvent;
window.qeen.randInt = randInt;
window.qeen.config = Config;
window.qeen.state = State;
window.qeen.InteractionEvent = InteractionEvent;
window.qeen.InvalidParameterError = InvalidParameterError;
window.qeen.AnalyticsEndpointError = AnalyticsEndpointError;
window.qeen.ResponseNotOkError = ResponseNotOkError;
window.qeen.URLContainsNoQeenError = URLContainsNoQeenError;

if (window.location.hash.includes('no-qeen')) {
  Config.noQeen = true;
  console.log(`${window.qeenError = 'Qeen is disabled; URL contains #no-qeen'}`);
  window.qeen.receiveMessage = receiveMessage;
  window.addEventListener('message', window.qeen.receiveMessage, false);
} else {
  Config.noQeen = false;
}
