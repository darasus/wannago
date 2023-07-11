import {baseUrl} from '../constants';

export function resetDB() {
  return fetch(`${baseUrl}/api/__reset-fdfdgwrwdwd133242__`, {method: 'POST'});
}
