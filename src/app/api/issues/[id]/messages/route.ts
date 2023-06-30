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

  const messages = await prisma.issueMessage.findMany({
    where: {
      issueId,
    },
    orderBy: {
      createdAt: 'asc',
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        }
      },
    },
  });

  if (messages) {
    return NextResponse.json(messages);
  }
  return new Response(null, {
    status: 400,
  });
}
