import { type NextRequest, NextResponse } from 'next/server';
import authOptions from '@/config/nextAuth';
import ExtendedUser from '@/models/ExtendedUser';
import prisma from '@/utils/prisma';
import { getServerSession } from 'next-auth';

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
        },
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

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: { id: string };
  },
) {
  const session = await getServerSession(authOptions);
  const user = session?.user as ExtendedUser;

  const issueId = parseInt(params.id);

  const { message } : { message: string } =  await request.json();

  const messageSave = await prisma.issueMessage.create({
    data: {
      message,
      issueId,
      userId: parseInt(user.id),
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  if (messageSave) {
    return NextResponse.json(messageSave);
  }
  return new Response(null, {
    status: 400,
  });
}