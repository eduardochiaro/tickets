const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const data = [
  {
    id: 1,
    title: 'Testing',
    description: 'this is a testing project',
    slug: 'testing',
    published: true,
    actions: {
      create: [
        {
          title: 'Move to Pending Action',
          originalStatusId: 1,
          finalStatusId: 2,
          actionText: 'Move to Pending',
        },
        {
          title: 'Send to User Action',
          originalStatusId: 2,
          finalStatusId: 4,
          actionText: 'Send to User',
        },
      ]
    }
  }
];

const seed = async () => {
  await prisma.project.createMany({
    data,
  });
  console.log('Added projects data');
}

module.exports = seed;
