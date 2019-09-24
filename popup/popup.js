import {
  isOnline,
  generateUrlId,
  generateStatusId,
  URL_REMOVED,
  URL_INFO_RECEIVED,
  URL_INFORMATION,
} from '../utils.js';

const container = document.getElementById('container');
const urls = document.getElementById('urls');
const statuses = document.getElementById('statuses');

chrome.storage.sync.get(
  [URL_INFORMATION],
  ({ [URL_INFORMATION]: urlsInfo }) => {
    Object.values(urlsInfo).forEach(setUrlNode);
  }
);

function getUrlAndStatusNodes (url) {
  const urlNode = container.querySelector(`*[id="${generateUrlId(url)}"]`);
  const statusNode = container.querySelector(`*[id="${generateStatusId(url)}"]`);
  return { urlNode, statusNode };
}

function setStatusClasses (statusNode, status) {
  statusNode.setAttribute(
    'class',
    `status ${isOnline(status) ? 'isOnline' : 'isOffline'}`
  );
}

function getOrCreateUrlNode ({ url, status }) {
  let { urlNode, statusNode } = getUrlAndStatusNodes(url);
  if (urlNode && statusNode) {
    setStatusClasses(statusNode, status);
    return { urlNode, statusNode };
  }

  urlNode = document.createElement('div');
  urlNode.setAttribute('id', `${generateUrlId(url)}`);

  statusNode = document.createElement('div');
  statusNode.setAttribute('id', `${generateStatusId(url)}`);
  setStatusClasses(statusNode, status);

  urls.appendChild(urlNode);
  statuses.appendChild(statusNode);

  return { urlNode, statusNode };
}

function setRowInfo ({ urlNode, statusNode }, { url }) {
  urlNode.innerText = url;
}

function setUrlNode (metadata) {
  const rowNodes = getOrCreateUrlNode(metadata);
  setRowInfo(rowNodes, metadata);
}

function removeUrlNode ({ url }) {
  let { urlNode, statusNode } = getUrlAndStatusNodes(url);
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