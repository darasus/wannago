import {useEffect, useRef} from 'react';
import Typed from 'typed.js';
import {Text} from 'ui';

export function PromptExamples() {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        'Birthday picnic in Central Park tomorrow afternoon',
        'Retirement party June 15, at 5pm, Greenwood 715 Orlando, max 20 people',
        'My birthday party next week at 7pm, Rokin 75 Amsterdam',
        'Rooftop terrace celebration tomorrow at 22:00 Le Rooftop Paris, max 10 people',
        'Baby shower next week at 7pm, 777 Ocean Avenue, Brooklyn',
      ],
      typeSpeed: 50,
      backDelay: 3000,
      backSpeed: 10,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className="text-center">
      <Text className="font-bold">Examples:</Text>
      <div />
      <Text>
        <span ref={el}></span>
      </Text>
    </div>
  );
}
