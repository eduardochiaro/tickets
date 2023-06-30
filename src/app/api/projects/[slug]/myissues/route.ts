import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { getServerSession } from 'next-auth';
import authOptions from '@/config/nextAuth';
import ExtendedUser from '@/models/ExtendedUser';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { slug: string };
  },
) {
  const session = await getServerSession(authOptions);
  const slug = params.slug;

  const user = session?.user as ExtendedUser;

  const issues = await prisma.issue.findMany({
    where: {
      project: {
        slug,
      },
      assignees: {
        some: {
          userId: parseInt(user.id),
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
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
      _count: {
        select: { messages: true },
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

  if (issues) {
    return NextResponse.json(issues);
  }
}
