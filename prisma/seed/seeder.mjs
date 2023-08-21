import * as dotenv from "dotenv";
dotenv.config({ path: `.env.local` });

import resetTestingSeed from './testing/reset.mjs';
import resetSeed from './seeding/reset.mjs';
import statusSeed from './seeding/statusSeed.mjs';
import typeSeed from './seeding/typeSeed.mjs';
import roleSeed from './seeding/roleSeed.mjs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const load = async () => {
  try {
    await resetTestingSeed();
    await resetSeed();
    await statusSeed();
    await typeSeed();
    await roleSeed();
    
    console.log('Seeding completed');
    
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
