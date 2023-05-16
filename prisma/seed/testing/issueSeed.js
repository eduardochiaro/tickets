const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');
const prisma = new PrismaClient();

const data = [
  {
    token: uuidv4(),
    title: 'Test Issue',
    description: 'this is a testing issue',
    projectId: 1,
    typeId: 2,
    statusId: 1,
    ownerId: 2,
		assignees: { create: [{ userId: 1 }, { userId: 2 }] }
  },
  {
    token: uuidv4(),
    title: 'Test Issue 2',
    description: 'this is a testing issue',
    projectId: 1,
    typeId: 1,
    statusId: 1,
    ownerId: 3,
		assignees: { create: [{ userId: 1 }, { userId: 4 }, { userId: 5 }, { userId:8 }, { userId: 6 }] }
  },
  {
    token: uuidv4(),
    title: 'Test Issue 3',
    description: 'this is a testing issue',
    projectId: 1,
    typeId: 3,
    statusId: 2,
    ownerId: 9,
  }
];

const seed = async () => {
  await data.map(async (single) => {
		await prisma.issue.create({
			data: single,
		});
	});
  console.log('Added issues data');
}

module.exports = seed;
