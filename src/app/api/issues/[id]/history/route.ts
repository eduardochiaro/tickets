import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { id: string };
  },
) {
  const issueId = parseInt(params.id);

  const history = await prisma.issueHistory.findMany({
    where: {
      issueId,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  if (history) {
    return NextResponse.json(history);
  }
  return new Response(null, {
    status: 400,
  });
}
