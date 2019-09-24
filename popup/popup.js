import { isOnline, URL_REMOVED, URL_INFO_RECEIVED, URL_INFORMATION } from '../utils.js';

const container = document.getElementById('container');
const urls = document.getElementById('urls');
const statuses = document.getElementById('statuses');

chrome.storage.sync.get(
  [URL_INFORMATION],
  ({ [URL_INFORMATION]: urlsInfo }) => {
    Object.values(urlsInfo).forEach(setUrlNode);
  }
);

function getOrCreateUrlNode ({ url, status }) {
  const urlNode = container.querySelector(`*[id="${url}-url"]`);
  const statusNode = container.querySelector(`*[id="${url}-status"]`);
  if (urlNode && statusNode) {
    return { urlNode, statusNode };
  }

  const urlDiv = document.createElement('div');
  urlDiv.setAttribute('id', `${url}-url`);

  const statusDiv = document.createElement('div');
  statusDiv.setAttribute('id', `${url}-status`);
  statusDiv.setAttribute(
    'class',
    `status ${isOnline(status) ? 'isOnline' : 'isOffline'}`
  );

  urls.appendChild(urlDiv);
  statuses.appendChild(statusDiv);

  return { urlNode: urlDiv, statusNode: statusDiv };

}

function setRowInfo ({ urlNode, statusNode }, { url, status }) {
  urlNode.innerText = url;
  // statusNode.innerText = status;
}

function setUrlNode (metadata) {
  const rowNodes = getOrCreateUrlNode(metadata);
  setRowInfo(rowNodes, metadata);
}

function removeUrlNode ({ url }) {
  const urlNode = container.querySelector(`*[id="${url}-url"]`);
  const statusNode = container.querySelector(`*[id="${url}-status"]`);
  urls.removeChild(urlNode);
  statuses.removeChild(statusNode);
}

chrome.runtime.onMessage.addListener(
  (request, sender, senderResponse) => {
    switch (request.type) {
      case URL_INFO_RECEIVED: {
        setUrlNode(request.payload);
        break;
      }
      case URL_REMOVED: {
        removeUrlNode(request.payload);
        break;
      }
      default:
    }
  }
);