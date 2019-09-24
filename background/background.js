import {
  getStatus,
  getUrlsInfo,
  URL_INFO_RECEIVED,
  URL_INFORMATION,
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
