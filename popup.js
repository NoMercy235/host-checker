import { ACTION } from './utils.js';

let container = document.getElementById('container');

chrome.storage.local.get(['time'], function({ time }) {
  container.innerText = time;
});

chrome.runtime.onMessage.addListener(
  (request, sender, senderResponse) => {
    switch (request.type) {
      case ACTION: {
        console.log(request.payload);
        break;
      }
      default:
    }
  }
);