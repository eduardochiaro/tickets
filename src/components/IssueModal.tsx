import { Issue, Status, Type, User, IssueHistory } from '@prisma/client';
import { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import useStaleSWR from '@/utils/staleSWR';
import Image from 'next/image';
import moment from 'moment';
import { DocumentIcon, HashtagIcon, XCircleIcon } from '@heroicons/react/20/solid';
import shortToken from '@/utils/shortToken';
import { Select, Tags } from '@/form';
import axios from 'axios';
import ConfirmationModal from '@/components/ConfirmationModal';
import { useSession } from 'next-auth/react';
import ExtendedUser from '@/models/ExtendedUser';
import { ArrowSmallRightIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/solid';

type IssueModalProps = {
  slug: string;
  issue:
    | (Issue & {
        assignees: User[];
        owner: User;
        shortToken: String;
      })
    | null;
  onClose: () => void;
  trigger: (e: boolean) => void;
};

function MoveAlongButton({ onClick, statusId }: { onClick: () => void; statusId: number }) {
  switch (statusId) {
    case 4:
    case 1:
      return (
        <button className="btn btn-secondary" onClick={onClick}>
          <span>Move to Pending</span>
          <ArrowSmallRightIcon className="h-5" />
        </button>
      );
    case 2:
      return (
        <button className="btn btn-secondary" onClick={onClick}>
          <span>Move to Waiting</span>
          <ArrowUturnLeftIcon className="h-5" />
        </button>
      );
    default:
      return null;
  }
}

export default function IssueModal({ slug, issue, onClose, trigger }: IssueModalProps) {
  const [issueData, setIssueData] = useState<IssueModalProps['issue'] | null>(null);
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isCloseIssueConfirmOpen, setIsCloseIssueConfirmOpen] = useState(false);
  const [imAlreadyAssigned, setImAlreadyAssigned] = useState(false);
  const { data: types } = useStaleSWR(`/api/types`);
  const { data: status } = useStaleSWR(`/api/status`);
  const { data: history, mutate: mutateHistory, isLoading: isLoadingHistory } = useStaleSWR(issue ? `/api/issues/${issue.id}/history` : null);

  const user = session?.user as ExtendedUser;

  useEffect(() => {
    setImAlreadyAssigned(false);
    if (issue) {
      setIssueData(issue);
      setIsCloseIssueConfirmOpen(false);
      mutateHistory();
      setIsOpen(true);
    } else {
      setIsOpen(false);
      setIssueData(null);
    }
  }, [issue, mutateHistory]);

  useEffect(() => {
    if (issueData) {
      if (issueData.assignees.filter((assignee: any) => assignee.user.id === parseInt(user.id)).length > 0) {
        setImAlreadyAssigned(true);
      }
    }
  }, [issueData, user]);

  const handleClose = (forced = false) => {
    if (!isCloseIssueConfirmOpen || forced) {
      setIsOpen(false);

      const timer = setTimeout(() => {
        onClose();
      }, 300);
      return () => clearTimeout(timer);
    }
  };

  const handleReopen = () => {
    setIsCloseIssueConfirmOpen(false);
  };

  const handleCloseIssue = async () => {
    setIsCloseIssueConfirmOpen(true);
  };

  const handleCloseIssueConfirm = async () => {
    const res = await axios.delete(`/api/issues/${issueData?.id}`);
    if (res.status === 200) {
      setIsCloseIssueConfirmOpen(false);
      handleClose(true);
      trigger(true);
    }
  };

  const handleAssingToMe = async () => {
    const message = `${user.name} assigned the issue to himself`;

    const res = await axios.put(`/api/issues/${issueData?.id}`, {
      assigneeId: [user.id],
      message,
    });
    if (res.status === 200) {
      mutateHistory();
      trigger(true);
      setIssueData(res.data);
    }
  };

  const handleMoveAlong = async () => {
    const statusIdChange = (id: number) => {
      switch (id) {
        default:
        case 1:
          return 2;
        case 2:
          return 4;
      }
    };

    const messageChange = (id: number) => {
      switch (id) {
        default:
        case 1:
          return `${user.name} changed the status to pending`;
        case 2:
          return `${user.name} changed the status to waiting`;
      }
    };

    const message = `${user.name} changed the status to pending`;
    const res = await axios.put(`/api/issues/${issueData?.id}`, {
      statusId: statusIdChange(issueData?.statusId || 0),
      message: messageChange(issueData?.statusId || 0),
    });
    if (res.status === 200) {
      mutateHistory();
      trigger(true);
      setIssueData(res.data);
    }
  };

  const handleMarkAsResolved = async () => {
    const message = `${user.name} marked the issue as resolved`;
    const res = await axios.put(`/api/issues/${issueData?.id}`, {
      statusId: 3,
      message,
    });
    if (res.status === 200) {
      mutateHistory();
      trigger(true);
      setIssueData(res.data);
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog onClose={() => handleClose()} className="relative z-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-5xl rounded-lg bg-white p-8">
                <div className="flex justify-between items-center">
                  <h3 className="group text-xl flex items-center gap-1">
                    <DocumentIcon className="h-4" />
                    Issue
                    <span className="opacity-60 text-lg inline-flex items-center flex-nowrap">
                      <HashtagIcon className="h-3" />
                      <span className="group-hover:hidden font-mono">{shortToken(issueData?.token)}</span>
                      <span className="opacity-0 group-hover:opacity-100 font-mono">{issueData?.token}</span>
                    </span>
                  </h3>
                  <button onClick={() => handleClose()} className="">
                    <XCircleIcon className="w-7 hover:text-red-500" />
                  </button>
                </div>
                <Dialog.Title className="text-3xl border-b pb-4 group">{issueData?.title}</Dialog.Title>
                <Dialog.Description className="pb-5 grid grid-cols-2 gap-4" as="div">
                  <div className="pt-4 pr-4 border-r flex flex-col">
                    <div className="col-span-2 p-4 bg-gray-200 text-sm m-1 ring-offset-2 ring-2 ring-gray-100 rounded ">
                      <h4 className="text-base font-semibold pb-2">Description</h4>
                      {issueData?.description}
                    </div>
                    <div className="col-span-2">
                      <h3 className="text-xl font-semibold mt-4 mb-2">History</h3>
                      {isLoadingHistory && <p className="text-sm text-center opacity-75">Loading...</p>}
                      {history?.length === 0 && !isLoadingHistory && <p className="text-sm text-center opacity-75">No history yet.</p>}
                      {history?.length > 0 && (
                        <ul className="space-y-2 p-2 overflow-y-auto max-h-60">
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
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Owner</h3>
                      {issueData?.owner === null && <p className="text-sm text-center opacity-75">No owner yet.</p>}
                      {issue && issueData?.owner !== null && (
                        <div className="flex items-center gap-2 group">
                          <Image
                            className="h-6 w-6 rounded-full ring-2 ring-gray-200 group-hover:ring-sky-400"
                            src={issueData?.owner?.image || ''}
                            alt={issueData?.owner?.name || ''}
                            title={issueData?.owner?.name || ''}
                            width={100}
                            height={100}
                          />
                          {issueData?.owner?.name}
                        </div>
                      )}
                      <div className="text-xs flex items-center gap-1 mt-2">
                        <span>created:</span>
                        <span className="font-mono">{moment(issueData?.createdAt).format('MM/DD/YY')}</span>
                        <span>at</span>
                        <span className="font-mono">{moment(issueData?.createdAt).format('h:mma')}</span>
                        <span>({moment(issueData?.createdAt).fromNow()})</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <Select label="Status" name="status" disabled={true} value={issueData?.statusId as unknown as string}>
                          {status?.map((s: Status) => (
                            <option key={s.id} value={s.id}>
                              {s.title}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div className="flex flex-col">
                        <Select label="Type" name="type" disabled={true} value={issueData?.typeId as unknown as string}>
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
                          value={issueData?.assignees?.map((a: any) => a.user) as []}
                          updateItem={() => null}
                        />
                        <div className="flex justify-end mt-2">
                          <button disabled={imAlreadyAssigned || issueData?.closed} onClick={() => handleAssingToMe()} className="btn btn-primary">
                            Assign to me
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Description>
                <div className="flex justify-end gap-6 mt-4">
                  <MoveAlongButton statusId={issueData?.statusId || 0} onClick={() => handleMoveAlong()} />
                  <div className="grow"> </div>
                  <button disabled={issueData?.closed || issueData?.statusId == 3} onClick={() => handleMarkAsResolved()} className="btn btn-primary">
                    Mark as Resolved
                  </button>
                  <button disabled={issueData?.closed} onClick={() => handleCloseIssue()} className="btn btn-action">
                    Close Issue
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
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
