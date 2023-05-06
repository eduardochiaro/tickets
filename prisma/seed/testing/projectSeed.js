const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const projects = [
  {
    title: 'Testing',
    description: 'this is a testing project',
    slug: 'testing'
  }
];

const seed = async () => {
  await prisma.project.createMany({
    data: projects,
  });
  console.log('Added projects data');
}

module.exports = seed;
