const { PrismaClient } = require('@prisma/client');
const { customAlphabet } = require('nanoid');
const { faker } = require('@faker-js/faker');
const nanoid = customAlphabet('1234567890abcdef', 16);
const prisma = new PrismaClient();

const data = [
  {
    token: nanoid(),
    title: faker.lorem.lines(1),
    description: faker.lorem.sentences(4),
    projectId: 1,
    typeId: 2,
    statusId: 1,
    ownerId: 2,
    createdAt: faker.date.recent({ days: 1 }) 
  },
  {
    token: nanoid(),
    title: faker.lorem.lines(1),
    description: faker.lorem.sentences(3),
    projectId: 1,
    typeId: 1,
    statusId: 1,
    ownerId: 3,
		assignees: { create: [{ userId: 1 }, { userId: 4 }, { userId: 5 }, { userId:8 }, { userId: 6 }] },
    createdAt: faker.date.recent({ days: 6 }),
    history: {
      create: [
        {
          message: faker.lorem.sentences(2),
          userId: 3,
          status: 'In Progress',
          type: 'Task',
          createdAt: faker.date.recent({ days: 6 })
        },
        {
          message: faker.lorem.sentences(2),
          userId: 1,
          status: 'In Progress',
          type: 'Task',
          createdAt: faker.date.recent({ days: 5 })
        },
        {
          message: faker.lorem.sentences(2),
          userId: 4,
          status: 'In Progress',
          type: 'Task',
          createdAt: faker.date.recent({ days: 4 })
        },
      ]
    } 
  },
  {
    token: nanoid(),
    title: faker.lorem.lines(1),
    description: faker.lorem.sentences(5),
    projectId: 1,
    typeId: 3,
    statusId: 2,
    ownerId: 9,
		assignees: { create: [{ userId: 8 }] },
    createdAt: faker.date.recent({ days: 33 }) 
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
