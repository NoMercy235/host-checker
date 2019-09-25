// import { URL_LOST_CONNECTION } from '../utils.js';

console.log('[CS] script loaded');
chrome.runtime.onMessage.addListener(
  (request, sender, senderResponse) => {
    console.log('received the message');
    switch (request.type) {
      case 'urlLostConnection': {
        alert(`Lost connection to ${request.payload}`);
        break;
      }
      default:
    }
  }
);
