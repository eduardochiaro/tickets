import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function GET(request: NextRequest) {
  const types = await prisma.type.findMany();

  if (types) {
    return NextResponse.json(types);
  }
  return new Response(null, {
    status: 400,
  });
}
