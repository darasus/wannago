// import {PrismaClient} from '@prisma/client/edge';
// import {getCurrentHub} from '@sentry/nextjs';
// import {withAccelerate} from '@prisma/extension-accelerate';

// let prisma: PrismaClient;

// if (process.env.NODE_ENV === 'production') {
//   prisma = new PrismaClient();
// } else {
//   if (!(global as any).prisma) {
//     (global as any).prisma = new PrismaClient({
//       // log:
//       //   process.env.NODE_ENV === 'development'
//       //     ? ['query', 'error', 'warn']
//       //     : ['error'],
//     });
//   }
//   prisma = (global as any).prisma;
// }

// prisma.$use(async (params, next) => {
//   const before = Date.now();

//   const result = await next(params);

//   const after = Date.now();

//   if (process.env.NODE_ENV === 'development') {
//     console.log(
//       `[PRISMA_QUERY] ${params.model}.${params.action} took ${after - before}ms`
//     );
//   }

//   return result;
// });

// prisma.$use(async (params, next) => {
//   const {model, action, runInTransaction, args} = params;
//   const description = [model, action].filter(Boolean).join('.');
//   const data = {
//     model,
//     action,
//     runInTransaction,
//     args,
//   };

//   const scope = getCurrentHub().getScope();
//   const parentSpan = scope?.getSpan();
//   const span = parentSpan?.startChild({
//     op: 'db',
//     description,
//     data,
//   });

//   scope?.addBreadcrumb({
//     category: 'db',
//     message: description,
//     data,
//   });

//   const result = await next(params);
//   span?.finish();

//   return result;
// });

// prisma.$extends(withAccelerate());

// export {prisma};

import {PrismaClient} from '@prisma/client/edge';
import {withAccelerate} from '@prisma/extension-accelerate';

function makePrisma() {
  return new PrismaClient().$extends(withAccelerate());
}

const globalForPrisma = global as unknown as {
  prisma: ReturnType<typeof makePrisma>;
};

export const prisma = globalForPrisma.prisma ?? makePrisma();

if (process.env.NODE_ENV !== 'production')
  globalForPrisma.prisma = makePrisma();
