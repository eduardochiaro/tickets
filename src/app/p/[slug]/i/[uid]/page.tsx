import IssueModal from "@/components/Issue";

export default async function Page({ params }: { params: { slug: string, uid: string } }) {

  const issue = await getIssueData(params.uid);
  const actions = await getActionsData(params.uid);
  return (
    <>
     <IssueModal slug={params.slug} actions={actions} issue={issue} />
    </>
  );
}

async function getIssueData(uid: string) {
  const issue = await prisma.issue.findFirst({
    where: {
      token: {
        startsWith: uid,
      },
    },
    include: {
      type: {
        select: {
          title: true,
        },
      },
      status: {
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
  if (!issue) {
    throw new Error('Failed to fetch data');
  }
  return issue;
}


async function getActionsData(slug: string) {
  const actions = await prisma.projectActionFlow.findMany({
    where: {
      project: {
        slug,
      },
    },
    include: {
      originalStatus: {
        select: {
          title: true,
        },
      },
      finalStatus: {
        select: {
          title: true,
        },
      },
    },
  });
  if (!actions) {
    throw new Error('Failed to fetch data');
  }
  return actions;
}