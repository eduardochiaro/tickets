import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function GET(request: NextRequest) {
  const statuses = await prisma.status.findMany();

  if (statuses) {
    return NextResponse.json(statuses);
  }
  return new Response(null, {
    status: 400,
  });
}
