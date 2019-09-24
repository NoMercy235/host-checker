import {
  getStatus,
  URL_INFO_RECEIVED,
  URL_INFORMATION,
} from './utils.js';

function getUrlsInfo () {
  return new Promise(resolve => {
    chrome.storage.sync.get(
      [URL_INFORMATION],
      ({ [URL_INFORMATION]: urlsInfo }) => {
        resolve(urlsInfo || {});
      });
    })
}

async function setUrlStatus (url, isUp) {
  const urlsInfo = await getUrlsInfo();
  urlsInfo[url] = {
    url,
    status: getStatus(isUp),
    lastSeen: (new Date()).toString(),
  };

  chrome.storage.sync.set({
    [URL_INFORMATION]: urlsInfo,
  });

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

const defaultUrls = [
  'http://cyoatta.xyz',
  'https://cyoatta.xyz',
  'https://www.google.com/',
  'http://doesnotexist.qwerty',
];

chrome.storage.sync.get(['urls'], ({ urls }) => {
  setInterval(() => {
    (urls || defaultUrls).forEach(url => {
      sendGetRequestTo(url);
    });
  }, 5000);
});
