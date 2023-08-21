import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


const seed = async () => {
  await prisma.issueMessage.deleteMany();
  console.log('Deleted records in issueMessage table');
  await prisma.$queryRaw`ALTER TABLE IssueMessage AUTO_INCREMENT = 1`;
  console.log('reset issueMessage auto increment to 1');

  await prisma.issueHistory.deleteMany();
  console.log('Deleted records in issueHistory table');
  await prisma.$queryRaw`ALTER TABLE IssueHistory AUTO_INCREMENT = 1`;
  console.log('reset issueHistory auto increment to 1');

  await prisma.usersOnIssues.deleteMany();
  console.log('Deleted records in usersOnIssues table');
  await prisma.$queryRaw`ALTER TABLE UsersOnIssues AUTO_INCREMENT = 1`;
  console.log('reset usersOnIssues auto increment to 1');
  
  await prisma.issue.deleteMany();
  console.log('Deleted records in issue table');
  await prisma.$queryRaw`ALTER TABLE Issue AUTO_INCREMENT = 1`;
  console.log('reset issue auto increment to 1');

  await prisma.projectActionFlow.deleteMany();
  console.log('Deleted records in projectActionFlow table');
  await prisma.$queryRaw`ALTER TABLE ProjectActionFlow AUTO_INCREMENT = 1`;
  console.log('reset projectActionFlow auto increment to 1');

  await prisma.projectUser.deleteMany();
  console.log('Deleted records in projectUser table');
  await prisma.$queryRaw`ALTER TABLE ProjectUser AUTO_INCREMENT = 1`;
  console.log('reset projectUser auto increment to 1');

  await prisma.project.deleteMany();
  console.log('Deleted records in projects table');
  await prisma.$queryRaw`ALTER TABLE Project AUTO_INCREMENT = 1`;
  console.log('reset projects auto increment to 1');

  await prisma.user.deleteMany();
  console.log('Deleted records in user table');
  await prisma.$queryRaw`ALTER TABLE User AUTO_INCREMENT = 1`;
  console.log('reset projects auto increment to 1');
}

export default seed;
