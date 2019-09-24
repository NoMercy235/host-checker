import {
  getStatus,
  getUrlsInfo,
  URL_INFO_RECEIVED,
  URL_INFORMATION,
} from './utils.js';

async function setUrlStatus (url, isUp) {
  const urlsInfo = await getUrlsInfo();
  // const shouldUpdate = urlsInfo[url].status !== getStatus(isUp);

  urlsInfo[url] = {
    url,
    status: getStatus(isUp),
    lastSeen: (new Date()).toString(),
  };

  // if (shouldUpdate) {
  //   chrome.storage.sync.set({
  //     [URL_INFORMATION]: urlsInfo,
  //   });
  // }

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

chrome.storage.sync.get(
  [URL_INFORMATION],
  ({ [URL_INFORMATION]: urlsInfo }) => {
  setInterval(() => {
    Object.values(urlsInfo).forEach(({ url }) => {
      sendGetRequestTo(url);
    });
  }, 5000);
});
