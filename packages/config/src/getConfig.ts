import {config} from './wannago.config';
import {validateConfig} from './validateConfig';

export function getConfig() {
  return validateConfig(config);
}
