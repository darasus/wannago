import {getMobileOperatingSystem} from './getMobileOperatingSystem';

export function Android() {
  return getMobileOperatingSystem() === 'iOS';
}
