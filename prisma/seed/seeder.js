const resetSeed = require('./seeding/reset');
const statusSeed = require('./seeding/statusSeed');
const typeSeed = require('./seeding/typeSeed');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const load = async () => {
  try {
    await resetSeed();
    await statusSeed();
    await typeSeed();
    
    console.log('Seeding completed');
    
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
