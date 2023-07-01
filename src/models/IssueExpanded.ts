import type { Issue, User } from "@prisma/client";

type IssueExpanded = Issue & {
  assignees: { user: { id: number; name: string | null; image: string | null } }[];
  owner: { name: string | null; image: string | null;};
  shortToken?: String;
  _count?: { messages: number; }
  type: { title: string; }
  status: { title: string; }
}

export default IssueExpanded;