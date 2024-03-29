import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


const data = [
  {
    id: 1,
    title: 'New'
  },
  {
    id: 2,
    title: 'Pending'
  },
  {
    id: 3,
    title: 'Resolved'
  },
  {
    id: 4,
    title: 'Waiting'
  }
];

const seed = async () => {
  await prisma.status.createMany({
    data,
  });
  console.log('Added status data');
}

export default seed;