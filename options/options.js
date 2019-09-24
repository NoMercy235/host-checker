import {
  isValidUrl,
  getStatus,
  getUrlsInfo,
  URL_ADDED,
  URL_INFORMATION,
} from '../utils.js';

const urlInput = document.getElementById('urlInput');
const addUrlBtn = document.getElementById('addUrlBtn');
const tableBody = document.getElementById('urlTableBody');

function addUrlColumn (tr, cell) {
  const urlTd = document.createElement('td');
  urlTd.innerText = cell;

  tr.appendChild(urlTd);
}

function addActionsColumn (tr, url) {
  const actionsTd = document.createElement('td');
  // TODO: implement delete action
}

function generateRow ({ url }) {
  const tr = document.createElement('tr');

  addUrlColumn(tr, url);

  tableBody.appendChild(tr);
}

chrome.storage.sync.get(
  [URL_INFORMATION],
  ({ [URL_INFORMATION]: urlsInfo }) => {
    Object.values(urlsInfo).forEach(generateRow);
  }
);

addUrlBtn.addEventListener('click', async () => {
  const url = urlInput.value;

  if (!isValidUrl(url)) {
    // TODO: show some error
    return ;
  }

  const urlsInfo = await getUrlsInfo();

  urlsInfo[url] = { url, status: getStatus(false) };

  chrome.storage.sync.set({
    [URL_INFORMATION]: urlsInfo,
  });

  chrome.runtime.sendMessage({
    type: URL_ADDED,
    payload: urlsInfo[url]
  });
});