const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { faker } = require('@faker-js/faker');

function createRandomUser() {
	const firstName = faker.person.firstName();
	const lastName = faker.person.lastName();
  return {
		name: `${firstName} ${lastName}`,
		email: faker.internet.email({ firstName, lastName}),
		image: faker.image.avatarGitHub(),
		username: faker.internet.userName({ firstName, lastName }).replace(/[^a-zA-Z0-9]/g,'').toLowerCase(),
  };
}

const users = faker.helpers.multiple(createRandomUser, {
  count: 9,
});

const data = users.map((user, index) => {
	return {
		...user,
	};
});

const seed = async () => {
	users.map(async (user, index) => {
		await prisma.user.upsert({
			where: { id: index + 1 },
			update: user,
			create: user
		});
	});
  console.log('Added user data');
}

module.exports = seed;
