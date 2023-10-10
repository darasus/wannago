import {connect} from '@planetscale/database';
import {PrismaPlanetScale} from '@prisma/adapter-planetscale';
import {PrismaClient} from '@prisma/client';
import {fetch as undiciFetch} from 'undici';

const connectionString = `${process.env.DATABASE_URL}`;
const connection = connect({url: connectionString, fetch: undiciFetch});
const adapter = new PrismaPlanetScale(connection);
export const prisma = new PrismaClient({adapter});

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

// export {prisma};
