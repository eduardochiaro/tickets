import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function GET(request: NextRequest) {
  const roles = await prisma.role.findMany();

  if (roles) {
    return NextResponse.json(roles);
  }
  return new Response(null, {
    status: 400,
  });
}
