import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text') as string;
  const users = await prisma.user.findMany({
    where: {
      name: {
        contains: text,
      },
    },
  });

  if (users) {
    return NextResponse.json(users);
  }
  return new Response(null, {
    status: 400,
  });
}
