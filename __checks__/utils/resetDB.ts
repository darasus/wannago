import axios from 'axios';
import {baseUrl} from '../constants';

export function resetDB() {
  return axios.post(`${baseUrl}/api/reset-fdfdgwrwdwd133242`);
}
