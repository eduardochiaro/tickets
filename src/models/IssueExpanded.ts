import type { Issue, User } from "@prisma/client";

type IssueExpanded = Issue & {
  assignees: User[];
  owner: User;
  shortToken: String;
}

export default IssueExpanded;