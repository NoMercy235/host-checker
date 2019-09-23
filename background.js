import { ACTION } from './utils.js';

function getUrlStatuses () {
  return new Promise(resolve => {
    chrome.storage.sync.get(['urlStatuses'], ({ urlStatuses }) => {
      resolve(urlStatuses || {});
    });
  })
}

async function setUrlStatus (url, isUp) {
  const urlStatuses = await getUrlStatuses();
  urlStatuses[url] = isUp;

  chrome.storage.sync.set({
    urlStatuses
  });

  chrome.runtime.sendMessage({
    type: ACTION,
    payload: { url, isUp },
  });
}

async function sendGetRequestTo (url) {
  let isUp;
  try {
    await fetch(url);
    isUp = true;
    console.log(`Url: ${url} is online`);
  } catch (e) {
    isUp = false;
    console.warn(`Url: ${url} is offline`);
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
  }, 3000);
});
