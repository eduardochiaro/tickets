import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: { id: string };
  },
) {
  const issueId = parseInt(params.id);

  const issue = await prisma.issue.update({
    data: {
      closed: true,
      closedAt: new Date(),
    },
    where: {
      id: issueId,
    },
  });

  if (issue) {
    return NextResponse.json(issue);
  }
  return new Response(null, {
    status: 400,
  });
}
