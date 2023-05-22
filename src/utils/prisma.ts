declare global {
  var prisma: PrismaClient; // This must be a `var` and not a `let / const`
}
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

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
prisma = global.prisma;

prisma.$extends({
  result: {
    issue: {
      shortToken: {
        needs: { token: true },
        compute(issue) {
          return issue.token.substring(0, 6);
        },
      },
    },
  },
});

export default prisma;
