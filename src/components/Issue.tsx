'use client';

import ProjectActionFlowWithStatues from '@/models/ProjectActionFlowWithStatues';
import IssueExpanded from '@/models/IssueExpanded';
import { ArrowLeftIcon, DocumentIcon, HashtagIcon, BoltIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/solid';
import shortToken from '@/utils/shortToken';
import useStaleSWR from '@/utils/staleSWR';
import { IssueHistory, Status, Type, User } from '@prisma/client';
import moment from 'moment';
import { Select, Tags } from '@/form';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import ExtendedUser from '@/models/ExtendedUser';
import Image from 'next/image';
import axios from 'axios';
import { getFirstName } from '../utils/getFirstName';
import Link from 'next/link';
import { convertToHTML } from '@/utils/convertToHTML';
import ConfirmationModal from './ConfirmationModal';
import SpinnerIcon from '@/icons/Spinner';

type IssueModalProps = {
  slug: string;
  actions: ProjectActionFlowWithStatues[];
  issue: IssueExpanded;
};

type IssueHistoryExpanded = IssueHistory & {
  user: User;
};

export default function IssueModal({ slug, actions, issue }: IssueModalProps) {
  const { data: history, mutate: mutateHistory, isLoading: isLoadingHistory } = useStaleSWR(issue ? `/api/issues/${issue.id}/history` : null);

  const [issueData, setIssueData] = useState<IssueExpanded>(issue);
  const [isCloseIssueConfirmOpen, setIsCloseIssueConfirmOpen] = useState(false);
  const [imAlreadyAssigned, setImAlreadyAssigned] = useState(false);

  const { data: session } = useSession();
  const user = session?.user as ExtendedUser;

  useEffect(() => {
    if (issueData) {
      if (issueData.assignees.filter((assignee: any) => assignee.user.id === parseInt(user?.id)).length > 0) {
        setImAlreadyAssigned(true);
      }
    }
  }, [issueData, user]);

  const handleCloseIssueConfirm = async () => {
    const res = await axios.delete(`/api/issues/${issueData?.id}`);
    if (res.status === 200) {
      setIssueData(res.data);
    }
  };

  const handleReopen = () => {
    setIsCloseIssueConfirmOpen(false);
  };

  const handleCloseIssue = async () => {
    setIsCloseIssueConfirmOpen(true);
  };

  const handleAssingToMe = async () => {
    const message = `assigned the issue to himself`;

    const res = await axios.put(`/api/issues/${issueData?.id}`, {
      assigneeId: [user.id],
      message,
    });
    if (res.status === 200) {
      mutateHistory();
      setIssueData(res.data);
    }
  };

  const handleMoveAlong = async (action: ProjectActionFlowWithStatues) => {
    const messageChange = `changed the status to ${action.finalStatus.title}`;

    const message = `changed the status to pending`;
    const res = await axios.put(`/api/issues/${issueData?.id}`, {
      statusId: action.finalStatusId,
      message: messageChange,
    });
    if (res.status === 200) {
      mutateHistory();
      setIssueData(res.data);
    }
  };

  const handleMarkAsResolved = async () => {
    const message = `marked the issue as resolved`;
    const res = await axios.put(`/api/issues/${issueData?.id}`, {
      statusId: 3,
      message,
    });
    if (res.status === 200) {
      mutateHistory();
      setIssueData(res.data);
    }
  };

  const ActionButton = ({ statusId, actions }: { statusId: number; actions: ProjectActionFlowWithStatues[] }) => {
    const actionsFiltered = actions.filter((action) => action.originalStatusId === statusId);
    return (
      <>
        {actionsFiltered.map((action: ProjectActionFlowWithStatues, index: number) => (
          <button key={index} className="btn" onClick={() => handleMoveAlong(action)}>
            <span>{action.actionText}</span>
          </button>
        ))}
      </>
    );
  };

  return (
    <>
      <div className="mx-auto py-4 md:py-7 grow flex flex-col max-w-6xl">
        <div>
          <Link href={`/p/${slug}`} className="inline-flex items-center gap-2 mb-6 btn btn-primary">
            <ArrowLeftIcon className="h-5" /> back to project
          </Link>
        </div>
        <div className="rounded-lg bg-white dark:bg-gray-800 p-8 grow flex flex-col">
          <div className="flex justify-between items-center">
            <h3 className="group text-xl flex items-center gap-1">
              <DocumentIcon className="h-5" />
              Issue
              <span className="opacity-60 text-lg inline-flex items-center flex-nowrap">
                <HashtagIcon className="h-4" />
                <span className="group-hover:hidden font-mono">{shortToken(issueData?.token)}</span>
                <span className="opacity-0 group-hover:opacity-100 font-mono">{issueData?.token}</span>
              </span>
            </h3>
          </div>
          <h2 className="text-base sm:text-lg md:text-xl lg:text-4xl font-bold leading-normal border-b dark:border-gray-600 pb-4">{issueData?.title}</h2>
          <div className="grid grid-1 xl:grid-cols-4 gap-4 grow">
            <div className="pt-4 pr-4 xl:border-r dark:border-gray-600 flex flex-col col-span-3">
              <div className="flex items-start gap-2">
                {issueData && issueData?.owner !== null && (
                  <Image
                    className="h-10 w-10 rounded-full ring-2 ring-gray-200 dark:ring-gray-600 group-hover:ring-sky-400"
                    src={issueData?.owner?.image || ''}
                    alt={issueData?.owner?.name || ''}
                    title={issueData?.owner?.name || ''}
                    width={100}
                    height={100}
                  />
                )}
                <div className="grow bg-gray-200 dark:bg-gray-600 text-sm m-1 ring-offset-2 ring-2 ring-gray-100 dark:ring-gray-800 rounded ">
                  <h4 className="text-sm p-2 bg-gray-300 dark:bg-gray-700 rounded-t">
                    <span className="font-semibold" title={issueData?.owner.name || 'No owner'}>
                      {issueData?.owner ? getFirstName(issueData.owner.name) : 'No owner'}
                    </span>{' '}
                    created this issue{' '}
                    <span className=" hover:underline" title={moment(issueData?.createdAt).format('MM/DD/YY h:mma')}>
                      {moment(issueData?.createdAt).fromNow()}
                    </span>
                  </h4>
                  <div
                    className="p-4"
                    dangerouslySetInnerHTML={{
                      __html: convertToHTML(issueData?.description),
                    }}
                  ></div>
                </div>
              </div>
              <div className="pl-12 flex flex-col grow">
                {isLoadingHistory && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <SpinnerIcon className="animate-spin h-5 w-5" />
                    Loading
                  </div>
                )}
                {history?.length === 0 && !isLoadingHistory && <p className="text-sm text-center opacity-75 mt-6">No history yet.</p>}
                {history?.map((row: IssueHistoryExpanded) => (
                  <div key={row.id} className="flex items-start gap-2 mx-4 border-l dark:border-gray-600 py-4 text-sm pb-6 last:pb-16 last:grow">
                    <div className="p-1 flex items-start -ml-3 rounded-full bg-white dark:bg-gray-800">
                      {row.isAction && <BoltIcon className="h-4 inline-block" title="Action" />}
                      {!row.isAction && <ChatBubbleBottomCenterTextIcon className="h-4 inline-block" />}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <span className="inline-flex items-center gap-1" title={row.user.name || ''}>
                        <Image
                          className="h-4 w-4 rounded-full ring-2 ring-gray-200 dark:ring-gray-600 mr-1"
                          src={row?.user?.image || ''}
                          alt={row?.user?.name || ''}
                          title={row?.user?.name || ''}
                          width={100}
                          height={100}
                        />
                        <span className="font-semibold">{getFirstName(row.user.name)}</span>
                        {row.isAction ? row.message : 'commented'}
                        <span className="hover:underline" title={moment(row.createdAt).format('MM/DD/YY h:mma')}>
                          {moment(row.createdAt).fromNow()}
                        </span>
                      </span>
                      {!row.isAction && (
                        <div
                          className="text-sm mt-2"
                          dangerouslySetInnerHTML={{
                            __html: convertToHTML(row.message),
                          }}
                        ></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-4 space-y-3">
              <h3 className="text-xl font-semibold mb-2">Creator</h3>
              {issueData?.owner === null && <p className="text-sm text-center opacity-75">No owner yet.</p>}
              {issueData && issueData?.owner !== null && (
                <div className="flex items-center gap-2 group">
                  <Image
                    className="h-6 w-6 rounded-full ring-2 ring-gray-200 dark:ring-gray-600 group-hover:ring-sky-400"
                    src={issueData?.owner?.image || ''}
                    alt={issueData?.owner?.name || ''}
                    title={issueData?.owner?.name || ''}
                    width={100}
                    height={100}
                  />
                  {issueData?.owner?.name}
                </div>
              )}
              <div className="text-xs flex flex-wrap items-center gap-1 mt-2 border-b dark:border-gray-600 pb-2">
                <span>created:</span>
                <span className="font-mono">{moment(issueData?.createdAt).format('MM/DD/YY')}</span>
                <span>at</span>
                <span className="font-mono">{moment(issueData?.createdAt).format('h:mma')}</span>
                <span>({moment(issueData?.createdAt).fromNow()})</span>
              </div>
              <div className="flex flex-col border-b dark:border-gray-600 pb-2">
                <span className="font-semibold mb-2">Type</span>
                <span className="text-sm">{issueData?.type?.title}</span>
              </div>
              <div className="flex flex-col border-b dark:border-gray-600 pb-2">
                <span className="font-semibold mb-2">Status</span>
                <span className="text-sm">{issueData?.status?.title}</span>
              </div>
              <div className="flex flex-col col-span-2">
                <Tags
                  label="Assignees"
                  name="assignees"
                  placeholder="add new person..."
                  api={`/api/projects/${slug}/team`}
                  indexFilter="user"
                  value={issueData?.assignees?.map((a: any) => a.user) as []}
                  updateItem={() => null}
                />
                <div className="flex justify-end mt-2">
                  <button disabled={imAlreadyAssigned || issueData?.closed} onClick={() => handleAssingToMe()} className="btn btn-small btn-primary">
                    Assign to me
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-6 pt-4 border-t dark:border-gray-600">
            <ActionButton statusId={issueData?.statusId || 0} actions={actions} />
            <div className="grow"></div>
            <button disabled={issueData?.closed || issueData?.statusId == 3} onClick={() => handleMarkAsResolved()} className="btn btn-primary">
              Mark as Resolved
            </button>
            <button disabled={issueData?.closed} onClick={() => handleCloseIssue()} className="btn btn-action">
              Close Issue
            </button>
          </div>
        </div>
      </div>
      <ConfirmationModal
        openModal={isCloseIssueConfirmOpen}
        onClose={() => handleReopen()}
        onConfirm={() => handleCloseIssueConfirm()}
        title="Close Issue"
        message="Are you sure you want to close this Issue? This will not mark as resolved. Please use the 'Mark as Resolved' button for that."
      />
    </>
  );
}
