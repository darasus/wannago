import {getMobileOperatingSystem} from './getMobileOperatingSystem';

export function iOS() {
  return getMobileOperatingSystem() === 'iOS';
}
