import {
  getStatus,
  getUrlsInfo,
  URL_INFO_RECEIVED,
  URL_INFORMATION,
  URL_LOST_CONNECTION,
} from '../utils.js';

async function setLocalUrlsInfo (overrideUrlsInfo) {
  const urlsInfo = overrideUrlsInfo || await getUrlsInfo();
  chrome.storage.local.set({
    [URL_INFORMATION]: urlsInfo
  });
}

setLocalUrlsInfo();

async function setUrlStatus (url, isUp) {
  const urlsInfo = await getUrlsInfo(true);

  urlsInfo[url] = {
    url,
    status: getStatus(isUp),
    lastSeen: (new Date()).toString(),
  };

  await setLocalUrlsInfo(urlsInfo);

  chrome.runtime.sendMessage({
    type: URL_INFO_RECEIVED,
    payload: urlsInfo[url],
  });
}

async function sendGetRequestTo (url) {
  let isUp;
  try {
    await fetch(url);
    isUp = true;
  } catch (e) {
    isUp = false;
  }
  await setUrlStatus(url, isUp);
}

setInterval(async () => {
    const urlsInfo = await getUrlsInfo();
    Object.values(urlsInfo || {}).forEach(({ url }) => {
      sendGetRequestTo(url);
    });
  },
  5000
);

setInterval(() => {
  console.log('[BG]: send message for content script');
  chrome.runtime.sendMessage({
    type: URL_LOST_CONNECTION,
    payload: 'some url',
  })
}, 3000);

chrome.runtime.onMessage.addListener(
  (request, sender, senderResponse) => {
    switch (request.type) {
      case 'test_action': {
        console.log('[BG]: received message for content script');
        break;
      }
      default:
    }
  }
);