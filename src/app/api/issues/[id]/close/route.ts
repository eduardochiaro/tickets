import { type NextRequest, NextResponse } from 'next/server';
import authOptions from '@/config/nextAuth';
import ExtendedUser from '@/models/ExtendedUser';
import prisma from '@/utils/prisma';
import { getServerSession } from "next-auth";

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

  const issue = await prisma.issue.findUnique({
    where: {
      id: issueId,
    },
    include: {
      status: {
        select: {
          title: true,
        },
      },
      type: {
        select: {
          title: true,
        },
      },
    }
  });

  if (issue) {

    await prisma.issueHistory.create({
      data: {
        issueId,
        status: issue.status.title,
        type: issue.type.title,
        message: `${user.name} closed the issue`,
        userId: parseInt(user.id),
      }
    });
  
    const issueReturn = await prisma.issue.update({
      data: {
        closed: true,
        closedAt: new Date(),
      },
      where: {
        id: issueId,
      },
    });
  
    if (issueReturn) {
      return NextResponse.json(issueReturn);
    }
  }
  return new Response(null, {
    status: 400,
  });
}
