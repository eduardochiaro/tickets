import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { slug: string };
  },
) {
  const slug = params.slug;
  
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text') as string;

  const find = text ? {
    user: {
      name : {
        contains: text,
      }
    }
  } : {};

  const projectUsers = await prisma.projectUser.findMany({
    where: {
      project: {
        slug,
      },
      ...find
    },
    orderBy: {
      roleId: 'asc',
    },
    include: {
      role: {
        select: {
          title: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
    },
  });

  if (projectUsers) {
    return NextResponse.json(projectUsers);
  }
}