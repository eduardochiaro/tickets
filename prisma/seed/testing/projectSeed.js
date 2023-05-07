const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const data = [
  {
    id: 1,
    title: 'Testing',
    description: 'this is a testing project',
    slug: 'testing',
    published: true,
  }
];

const seed = async () => {
  await prisma.project.createMany({
    data,
  });
  console.log('Added projects data');
}

module.exports = seed;
