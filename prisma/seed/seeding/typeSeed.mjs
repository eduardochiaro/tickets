import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const data = [
  {
    title: 'Bug'
  },
  {
    title: 'Feature Request'
  },
  {
    title: 'Sales Question'
  },
  {
    title: 'How To'
  },
  {
    title: 'Technical Issue'
  },
  {
    title: 'Desktop Software'
  }
];

const seed = async () => {
  await prisma.type.createMany({
    data,
  });
  console.log('Added type data');
}

export default seed;