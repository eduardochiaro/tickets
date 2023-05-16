const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { faker } = require('@faker-js/faker');

const data = [];

for (let index = 1; index < 10; index++) {

	const user = {
		id: index,
		name: faker.person.fullName(),
		email: faker.internet.email(),
		image: faker.image.avatarGitHub()
	}
	data.push(user);
}


const seed = async () => {
  await prisma.user.createMany({
    data,
  });
  console.log('Added user data');
}

module.exports = seed;
