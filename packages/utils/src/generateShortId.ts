import {init} from '@paralleldrive/cuid2';

const createEventShortId = init({
  length: 6,
});

const createEventCode = init({
  length: 4,
});

export function generateShortId() {
  return createEventShortId();
}

export function generateEventCode() {
  return createEventCode().toUpperCase();
}
