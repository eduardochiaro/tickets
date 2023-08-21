import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

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
		id: index + 1,
		...user
	}
});

const seed = async () => {
	console.log('Seeding ' + users.length + ' users');
	await prisma.user.createMany({
		data
	});
	data.map(async (user) => {
		await prisma.projectUser.create({
			data: {
				userId: user.id,
				projectId: 1,
				roleId: 3
			}
		});
	});
  console.log('Added user data');
}

export default seed;
