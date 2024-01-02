import type {inferRouterInputs, inferRouterOutputs} from '@trpc/server';
import type {AppRouter} from './src/root';

// TODO: Maybe just export `createAction` instead of the whole `trpc` object?
export {t} from './src/trpc';

export type {AppRouter} from './src/root';

export type RouterInputs = inferRouterInputs<AppRouter>;

export type RouterOutputs = inferRouterOutputs<AppRouter>;
