import {init} from '@paralleldrive/cuid2';

const createId = init({
  length: 6,
});

export function generateShortId() {
  return createId();
}
