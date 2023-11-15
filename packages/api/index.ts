import type {inferRouterInputs, inferRouterOutputs} from '@trpc/server';

import type {AppRouter} from './src/root';

// TODO: Maybe just export `createAction` instead of the whole `trpc` object?
export {t} from './src/trpc';

export {type AppRouter} from './src/root';

/**
 * Inference helpers for input types
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;
