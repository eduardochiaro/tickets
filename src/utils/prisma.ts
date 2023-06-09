import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient; // This must be a `var` and not a `let / const`
}

if (!global.prisma) {
  global.prisma = new PrismaClient(
    process.env.NODE_ENV === 'production'
      ? {
          log: [
            {
              emit: 'stdout',
              level: 'error',
            },
          ],
        }
      : {
          log: [
            {
              emit: 'stdout',
              level: 'query',
            },
            {
              emit: 'stdout',
              level: 'error',
            },
            {
              emit: 'stdout',
              level: 'info',
            },
            {
              emit: 'stdout',
              level: 'warn',
            },
          ],
        },
  );
}
export default global.prisma;
