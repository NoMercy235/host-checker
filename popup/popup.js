import { ACTION } from '../utils.js';

const container = document.getElementById('container');
const urls = document.getElementById('urls');
const statuses = document.getElementById('statuses');

function getStatus (isUp) {
  return isUp ? 'Online' : 'Offline';
}

function getOrCreateUrlNode ({ url }) {
  const urlNode = container.querySelector(`*[id="${url}-url"]`);
  const statusNode = container.querySelector(`*[id="${url}-status"]`);
  if (urlNode && statusNode) {
    return { urlNode, statusNode };
  }

  const urlDiv = document.createElement('div');
  urlDiv.setAttribute('id', `${url}-url`);

  const statusDiv = document.createElement('div');
  statusDiv.setAttribute('id', `${url}-status`);

  urls.appendChild(urlDiv);
  statuses.appendChild(statusDiv);

  return { urlNode: urlDiv, statusNode: statusDiv };

}

function setRowInfo ({ urlNode, statusNode }, { url, isUp }) {
  urlNode.innerText = url;
  statusNode.innerText = getStatus(isUp);
}

function setUrlNode (metadata) {
  const rowNodes = getOrCreateUrlNode(metadata);
  setRowInfo(rowNodes, metadata);
}

chrome.runtime.onMessage.addListener(
  (request, sender, senderResponse) => {
    switch (request.type) {
      case ACTION: {
        setUrlNode(request.payload);
        break;
      }
      default:
    }
  }
);