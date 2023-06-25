import { type NextRequest, NextResponse } from 'next/server';
import authOptions from '@/config/nextAuth';
import ExtendedUser from '@/models/ExtendedUser';
import prisma from '@/utils/prisma';
import { getServerSession } from "next-auth";

const findIssue = async (id: number) => {
  return prisma.issue.findUnique({
    where: {
      id,
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
};

const saveHistory = async (issueId: number, status: string, type: string, message: string, userId: number) => {
  return prisma.issueHistory.create({
    data: {
      issueId,
      status,
      type,
      message,
      userId,
    }
  });
};

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: { id: string };
  },
) {
  const session = await getServerSession(authOptions);
  const user = session?.user as ExtendedUser;

  const { assigneeId = [] } : { assigneeId: string[] } = await request.json();

  const issueId = parseInt(params.id);

  const issue = await findIssue(issueId);

  if (issue) {
    const message = (assigneeId.length == 1 && assigneeId[0] == user.id) ? 
      `${user.name} assigned the issue to himself`: 
      `${user.name} assigned ${assigneeId.length} users to the issue`;

    await saveHistory(issueId, issue.status.title, issue.type.title, message, parseInt(user.id));

    const issueReturn = await prisma.issue.update({
      data: {
        assignees: {
          connectOrCreate: assigneeId.map((id) => ({ where: { issueId_userId: { userId: parseInt(id), issueId } }, create: { userId: parseInt(id) } } )),
        },
      },
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
        owner: {
          select: {
            name: true,
            image: true,
          },
        },
        assignees: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
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

export async function DELETE(
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

  const issue = await findIssue(issueId);

  if (issue) {
    const message = `${user.name} closed the issue`;
    await saveHistory(issueId, issue.status.title, issue.type.title, message, parseInt(user.id));
  
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
