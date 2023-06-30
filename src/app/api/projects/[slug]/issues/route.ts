import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { getServerSession } from 'next-auth';
import authOptions from '@/config/nextAuth';
import ExtendedUser from '@/models/ExtendedUser';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890abcdef', 16);

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { slug: string };
  },
) {
  const slug = params.slug;

  const issues = await prisma.issue.findMany({
    where: {
      project: {
        slug,
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

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: { slug: string };
  },
) {
  const slug = params.slug;
  const session = await getServerSession(authOptions);
  const user = session?.user as ExtendedUser;

  const { title, type, description } = await request.json();

  const issue = await prisma.issue.create({
    data: {
      token: nanoid(),
      title,
      type: {
        connect: {
          id: parseInt(type),
        },
      },
      status: {
        connect: {
          id: 1,
        },
      },
      description,
      owner: {
        connect: {
          id: parseInt(user.id),
        },
      },
      project: {
        connect: {
          slug,
        },
      },
    },
  });
  if (issue) {
    return NextResponse.json(issue);
  }

  return new Response(null, {
    status: 400,
  });
}
