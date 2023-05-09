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

  const project = await prisma.project.findFirst({
    where: {
      slug,
    },
  });

  if (project) {
    return NextResponse.json(project);
  }
	return new Response(null, {
    status: 400,
  });
}
