'use client';

import JSConfetti from 'js-confetti';

export function useConfetti() {
  const confetti = () => {
    if (typeof window !== 'undefined') {
      const conf = new JSConfetti();
      conf.addConfetti({confettiNumber: 200, emojiSize: 10});
    }
  };

  return {confetti};
}
