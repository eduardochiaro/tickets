import * as dotenv from "dotenv";
dotenv.config({ path: `.env.local` });

import resetSeed from './testing/reset.mjs';
import projectSeed from './testing/projectSeed.mjs';
import issueSeed from './testing/issueSeed.mjs';
import userSeed from './testing/userSeed.mjs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const load = async () => {
  try {
    await resetSeed();
    await projectSeed();
		await userSeed();
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
