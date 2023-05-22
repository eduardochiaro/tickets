import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function GET(request: NextRequest) {
  const project = await prisma.project.findMany({
    where: {
      published: true,
    },
  });

  if (project) {
    return NextResponse.json(project);
  }
  return new Response(null, {
    status: 400,
  });
}
