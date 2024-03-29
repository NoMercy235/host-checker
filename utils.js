export const URL_INFORMATION = 'urlInformation';
export const URL_ADDED = 'urlAdded';
export const URL_REMOVED = 'urlRemoved';
export const URL_LOST_CONNECTION = 'urlLostConnection';

export const URL_INFO_RECEIVED = 'url_status_changed';

export function getStatus (isUp) {
  return isUp ? 'Online' : 'Offline';
}

export function isOnline (input) {
  return input === true || input === 'Online';
}

export function getUrlsInfo (local) {
  return new Promise(resolve => {
    chrome.storage[local ? 'local' : 'sync'].get(
      [URL_INFORMATION],
      ({ [URL_INFORMATION]: urlsInfo }) => {
        resolve(urlsInfo || {});
      });
  })
}

export function isValidUrl (url) {
  const expression = /(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
  const regex = new RegExp(expression);
  return url.match(regex);
}

export function generateUrlId (url) {
  return `${url}-url`;
}

export function generateStatusId (url) {
  return `${url}-status`;
}