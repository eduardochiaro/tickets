const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const seed = async () => {
  await prisma.project.deleteMany();
  console.log('Deleted records in projects table');

  await prisma.$queryRaw`ALTER TABLE Project AUTO_INCREMENT = 1`;
  console.log('reset projects auto increment to 1');
}

module.exports = seed;
