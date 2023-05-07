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

  const issues = await prisma.issue.findMany({
    where: {
      project: {
        slug
      }
    },
    include: {
      status: true,
      type: true,
    }
  });

  if (issues) {
    return NextResponse.json(issues);
  }
}
