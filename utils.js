export const URL_INFORMATION = 'urlInformation';

export const URL_INFO_RECEIVED = 'url_status_changed';

export function getStatus (isUp) {
  return isUp ? 'Online' : 'Offline';
}