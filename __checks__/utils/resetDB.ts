import axios from 'axios';
import {getBaseUrl} from './getBaseUrl';

export function resetDB() {
  return axios.post(`${getBaseUrl()}/api/reset-fdfdgwrwdwd133242`);
}
