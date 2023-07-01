"use client";

import ProjectActionFlowWithStatues from '@/models/ProjectActionFlowWithStatues';
import IssueExpanded from "@/models/IssueExpanded";
import { DocumentIcon, HashtagIcon } from "@heroicons/react/24/solid";
import shortToken from "@/utils/shortToken";
import useStaleSWR from "@/utils/staleSWR";
import { IssueHistory, Status, Type } from "@prisma/client";
import moment from "moment";
import { Select, Tags } from "@/form";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ExtendedUser from "@/models/ExtendedUser";
import Image from "next/image";
import axios from "axios";

type IssueModalProps = {
  slug: string;
  actions: ProjectActionFlowWithStatues[];
  issue: IssueExpanded | null;
};

export default function IssueModal({ slug, actions, issue }: IssueModalProps) {
  const { data: types } = useStaleSWR(`/api/types`);
  const { data: status } = useStaleSWR(`/api/status`);
  const { data: history, mutate: mutateHistory, isLoading: isLoadingHistory } = useStaleSWR(issue ? `/api/issues/${issue.id}/history` : null);

  const [imAlreadyAssigned, setImAlreadyAssigned] = useState(false);

  const { data: session } = useSession();
  const user = session?.user as ExtendedUser;

  useEffect(() => {
    if (issue) {
      if (issue.assignees.filter((assignee: any) => assignee.user.id === parseInt(user?.id)).length > 0) {
        setImAlreadyAssigned(true);
      }
    }
  }, [issue, user]);


  const handleAssingToMe = async () => {
    const message = `${user.name} assigned the issue to himself`;

    const res = await axios.put(`/api/issues/${issue?.id}`, {
      assigneeId: [user.id],
      message,
    });
    if (res.status === 200) {
      mutateHistory();
    }
  };


  return (
    <div className="px-4 md:px-10 py-4 md:py-7 grow flex flex-col">
      <div className="rounded-lg bg-white p-8 grow flex flex-col">
        <div className="flex justify-between items-center">
          <h3 className="group text-xl flex items-center gap-1">
            <DocumentIcon className="h-5" />
            Issue
            <span className="opacity-60 text-lg inline-flex items-center flex-nowrap">
              <HashtagIcon className="h-4" />
              <span className="group-hover:hidden font-mono">{shortToken(issue?.token)}</span>
              <span className="opacity-0 group-hover:opacity-100 font-mono">{issue?.token}</span>
            </span>
          </h3>
        </div>
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800 border-b pb-4">{issue?.title}</h2>
        <div className="grid grid-cols-2 gap-4 grow">
          <div className="pt-4 pr-4 border-r flex flex-col">
            <div className="col-span-2 p-4 bg-gray-200 text-sm m-1 ring-offset-2 ring-2 ring-gray-100 rounded ">
              <h4 className="text-base font-semibold pb-2">Description</h4>
              {issue?.description}
            </div>
            <h3 className="text-xl font-semibold mt-4 mb-2">History</h3>
            <div className=" col-span-2 grow ">
            {isLoadingHistory && <p className="text-sm text-center opacity-75">Loading...</p>}
            {history?.length === 0 && !isLoadingHistory && <p className="text-sm text-center opacity-75">No history yet.</p>}
            {history?.length > 0 && (
              <ul className="space-y-2 p-2 overflow-y-auto">
                {history?.map((row: IssueHistory) => (
                  <li key={row.id} className="text-xs p-2 rounded bg-gray-100 flex items-center gap-2">
                    <span className="flex flex-col text-right border-r pr-2 border-gray-600 font-semibold font-mono">
                      <span>{moment(row.createdAt).format('MM/DD/YY')}</span>
                      <span>{moment(row.createdAt).format('h:mma')}</span>
                    </span>
                    <span>{row.message}</span>
                  </li>
                ))}
              </ul>
            )}
            </div>
          </div>
          <div className="pt-4 space-y-3">
            <h3 className="text-xl font-semibold mb-2">Owner</h3>
            {issue?.owner === null && <p className="text-sm text-center opacity-75">No owner yet.</p>}
            {issue && issue?.owner !== null && (
              <div className="flex items-center gap-2 group">
                <Image
                  className="h-6 w-6 rounded-full ring-2 ring-gray-200 group-hover:ring-sky-400"
                  src={issue?.owner?.image || ''}
                  alt={issue?.owner?.name || ''}
                  title={issue?.owner?.name || ''}
                  width={100}
                  height={100}
                />
                {issue?.owner?.name}
              </div>
            )}
            <div className="text-xs flex items-center gap-1 mt-2">
              <span>created:</span>
              <span className="font-mono">{moment(issue?.createdAt).format('MM/DD/YY')}</span>
              <span>at</span>
              <span className="font-mono">{moment(issue?.createdAt).format('h:mma')}</span>
              <span>({moment(issue?.createdAt).fromNow()})</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Select label="Status" name="status" disabled={true} value={issue?.statusId as unknown as string}>
                  {status?.map((s: Status) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex flex-col">
                <Select label="Type" name="type" disabled={true} value={issue?.typeId as unknown as string}>
                  {types?.map((s: Type) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex flex-col col-span-2">
                <Tags
                  label="Assignees"
                  name="assignees"
                  placeholder="add new person..."
                  api={`/api/projects/${slug}/team`}
                  indexFilter="user"
                  value={issue?.assignees?.map((a: any) => a.user) as []}
                  updateItem={() => null}
                />
                <div className="flex justify-end mt-2">
                  <button disabled={imAlreadyAssigned || issue?.closed} onClick={() => handleAssingToMe()} className="btn btn-primary">
                    Assign to me
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-6 mt-4">
          <div className="grow"> </div>
          <button disabled={issue?.closed || issue?.statusId == 3}  className="btn btn-primary">
            Mark as Resolved
          </button>
          <button disabled={issue?.closed}  className="btn btn-action">
            Close Issue
          </button>
        </div>
      </div>
    </div>
  );
}