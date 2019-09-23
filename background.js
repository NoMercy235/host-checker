async function sendGetRequestTo (url) {
  try {
    await fetch(url);
    console.log(`Url: ${url} is online`);
  } catch (e) {
    console.warn(`Url: ${url} is offline`);
  }
}

const defaultUrls = [
  'http://cyoatta.xyz',
  'https://cyoatta.xyz',
  'https://www.google.com/',
  'http://doesnotexist.qwerty',
];

chrome.storage.sync.get(['urls'], ({ urls }) => {
  (urls || defaultUrls).forEach(url => {
    sendGetRequestTo(url);
  });
});
