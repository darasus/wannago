import axios from 'axios';
import {baseUrl} from '../constants';

export function resetDB() {
  return axios.post(`${baseUrl}/api/__reset-fdfdgwrwdwd133242__`);
}
