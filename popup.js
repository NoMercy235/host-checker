let container = document.getElementById('container');

chrome.storage.local.get(['time'], function({ time }) {
  container.innerText = time;
});
