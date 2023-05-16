const resetSeed = require('./testing/reset');
const projectSeed = require('./testing/projectSeed');
const issueSeed = require('./testing/issueSeed');
const userSeed = require('./testing/userSeed');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const load = async () => {
  try {
    await resetSeed();
		await userSeed();
    await projectSeed();
    await issueSeed();
    
    console.log('Seeding completed');
    
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
