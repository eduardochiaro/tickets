const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const seed = async () => {
  await prisma.project.deleteMany();
  console.log('Deleted records in projects table');
  await prisma.$queryRaw`ALTER TABLE Project AUTO_INCREMENT = 1`;
  console.log('reset projects auto increment to 1');

  await prisma.type.deleteMany();
  console.log('Deleted records in type table');
  await prisma.$queryRaw`ALTER TABLE Type AUTO_INCREMENT = 1`;
  console.log('reset type auto increment to 1');

  await prisma.status.deleteMany();
  console.log('Deleted records in status table');
  await prisma.$queryRaw`ALTER TABLE Status AUTO_INCREMENT = 1`;
  console.log('reset status auto increment to 1');

  await prisma.issue.deleteMany();
  console.log('Deleted records in issue table');
  await prisma.$queryRaw`ALTER TABLE Issue AUTO_INCREMENT = 1`;
  console.log('reset issue auto increment to 1');
}

module.exports = seed;
