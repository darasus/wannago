'use client';

import {useEffect, useState} from 'react';
import {Button, CardBase, Text} from 'ui';
import {useLocalStorage} from 'usehooks-ts';

export function CookieConsent() {
  const [canRender, setCanRender] = useState(false);
  const [hasConsent, setHasConsent] = useLocalStorage('cookie-consent', false);

  const handleAccept = () => {
    setHasConsent(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setCanRender(true);
    }, 1000);
  }, []);

  if (typeof window === 'undefined') {
    return null;
  }

  if (!canRender) {
    return null;
  }

  if (hasConsent) {
    return null;
  }

  return (
    <CardBase className="fixed left-4 bottom-4 right-4 md:right-auto z-50">
      <div>
        <div className="mb-4 max-w-18">
          <Text>
            This site uses cookies to measure and improve your experience.
          </Text>
        </div>
        <div className="flex items-center">
          <Button variant="link" size="sm" as="a" href="/cookie-policy">
            Cookie Policy
          </Button>
          <div className="grow" />
          <Button size="sm" onClick={handleAccept}>
            Accept
          </Button>
        </div>
      </div>
    </CardBase>
  );
}
