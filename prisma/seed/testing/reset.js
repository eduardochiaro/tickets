const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const seed = async () => {

  await prisma.usersOnIssues.deleteMany();
  console.log('Deleted records in usersOnIssues table');
  await prisma.$queryRaw`ALTER TABLE UsersOnIssues AUTO_INCREMENT = 1`;
  console.log('reset issue auto increment to 1');
  
  await prisma.issue.deleteMany();
  console.log('Deleted records in issue table');
  await prisma.$queryRaw`ALTER TABLE Issue AUTO_INCREMENT = 1`;
  console.log('reset issue auto increment to 1');

  await prisma.project.deleteMany();
  console.log('Deleted records in projects table');
  await prisma.$queryRaw`ALTER TABLE Project AUTO_INCREMENT = 1`;
  console.log('reset projects auto increment to 1');

  await prisma.user.deleteMany();
  console.log('Deleted records in user table');
  await prisma.$queryRaw`ALTER TABLE User AUTO_INCREMENT = 1`;
  console.log('reset projects auto increment to 1');
}

module.exports = seed;
