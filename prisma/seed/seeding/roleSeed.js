const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const data = [
  {
    title: 'Project Owner'
  },
  {
    title: 'Assistant Project Manager'
  },
  {
    title: 'Engineer'
  },
  {
    title: 'Support'
  }
];

const seed = async () => {
  await prisma.role.createMany({
    data,
  });
  console.log('Added role data');
}

module.exports = seed;
