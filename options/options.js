import {
  isValidUrl,
  getStatus,
  getUrlsInfo,
  URL_ADDED,
  URL_REMOVED,
  URL_INFORMATION,
} from '../utils.js';

const urlInput = document.getElementById('urlInput');
const addUrlBtn = document.getElementById('addUrlBtn');
const tableBody = document.getElementById('urlTableBody');

function removeRow (url) {
  const targetRow = document.getElementById(url);
  tableBody.removeChild(targetRow);
}

function addUrlColumn (tr, cell) {
  const urlTd = document.createElement('td');
  urlTd.innerText = cell;

  tr.appendChild(urlTd);
}

function addActionsColumn (tr, url) {
  const actionsTd = document.createElement('td');
  // TODO: implement delete action

  const removeUrlDiv = document.createElement('button');
  removeUrlDiv.innerText = 'x';
  removeUrlDiv.addEventListener('click', async () => {
    const urlsInfo = await getUrlsInfo();
    chrome.runtime.sendMessage({
      type: URL_REMOVED,
      payload: urlsInfo[url]
    });
    delete urlsInfo[url];
    saveUrlsInfo(urlsInfo);
    removeRow(url);
  });

  actionsTd.appendChild(removeUrlDiv);
  tr.appendChild(actionsTd);
}

function generateRow ({ url }) {
  const tr = document.createElement('tr');
  tr.setAttribute('id', url);

  addUrlColumn(tr, url);
  addActionsColumn(tr, url);

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

  saveUrlsInfo(urlsInfo);

  chrome.runtime.sendMessage({
    type: URL_ADDED,
    payload: urlsInfo[url]
  });

  urlInput.value = '';
  generateRow({ url });
});

function saveUrlsInfo (urlsInfo) {
  chrome.storage.sync.set({
    [URL_INFORMATION]: urlsInfo,
  });
}