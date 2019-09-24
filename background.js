import {
  getStatus,
  getUrlsInfo,
  URL_INFO_RECEIVED,
  URL_INFORMATION,
} from './utils.js';

async function setUrlStatus (url, isUp) {
  const urlsInfo = await getUrlsInfo();

  urlsInfo[url] = {
    url,
    status: getStatus(isUp),
    lastSeen: (new Date()).toString(),
  };

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
    // console.log(`Url: ${url} is online`);
  } catch (e) {
    isUp = false;
    // console.warn(`Url: ${url} is offline`);
  }
  await setUrlStatus(url, isUp);
}

setInterval(() => {
  chrome.storage.sync.get(
    [URL_INFORMATION],
    ({ [URL_INFORMATION]: urlsInfo }) => {
      Object.values(urlsInfo).forEach(({ url }) => {
        sendGetRequestTo(url);
      });
    }
  )},
  5000
);
