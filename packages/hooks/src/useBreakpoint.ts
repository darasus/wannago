import create from '@kodingdotninja/use-tailwind-breakpoint';
import resolveConfig from 'tailwindcss/resolveConfig';

import tailwindConfig from '../../../apps/web/tailwind.config.js';

const config = resolveConfig(tailwindConfig);

export const {useBreakpoint} = create(config.theme?.screens);
