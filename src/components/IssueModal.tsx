import { Issue, Status, Type, User, IssueHistory } from '@prisma/client';
import { useEffect, useState, Fragment, use } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import useStaleSWR from '../utils/staleSWR';
import Image from 'next/image';
import moment from 'moment';
import { DocumentIcon, HashtagIcon, XCircleIcon } from '@heroicons/react/20/solid';
import shortToken from '@/utils/shortToken';
import { Select, Tags } from '@/form';
import axios from 'axios';
import ConfirmationModal from './ConfirmationModal';
import { useSession } from "next-auth/react";
import ExtendedUser from "@/models/ExtendedUser";


type IssueModalProps = {
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

export default function IssueModal({ issue, onClose, trigger }: IssueModalProps) {
  const [issueData, setIssueData] = useState<IssueModalProps["issue"] | null>(null);
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [imAlreadyAssigned, setImAlreadyAssigned] = useState(false);
  const { data: types } = useStaleSWR(`/api/types`);
  const { data: status } = useStaleSWR(`/api/status`);
  const { data: history, mutate: mutateHistory } = useStaleSWR(issue ? `/api/issues/${issue.id}/history` : null);

  const user = session?.user as ExtendedUser;

  useEffect(() => {
    setImAlreadyAssigned(false);
    if (issue) {
      setIssueData(issue);
      setIsConfirmOpen(false);
      mutateHistory();
      setIsOpen(true);
    } else {
      setIsOpen(false);
      setIssueData(null);
    }
  }, [issue]);

  useEffect(() => {
    if (issueData) {
      if (issueData.assignees.filter((assignee) => assignee.id === parseInt(user.id))) {
        setImAlreadyAssigned(true);
      }
    }
  }, [issueData]);

  const handleClose = (forced = false) => {
    if (!isConfirmOpen || forced) {
      setIsOpen(false);

      const timer = setTimeout(() => {
        onClose();
      }, 300);
      return () => clearTimeout(timer);
    }
  };

  const handleReopen = () => {
    setIsConfirmOpen(false);
  }

  const handleCloseIssue = async () => {
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    const res = await axios.delete(`/api/issues/${issueData?.id}`);
    if (res.status === 200) {
      setIsConfirmOpen(false);
      handleClose(true);
      trigger(true);
    }
  };

  const handleAssingToMe = async () => {
    const res = await axios.put(`/api/issues/${issueData?.id}`, {
      assigneeId: [user.id],
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
                      <span className="group-hover:hidden">{shortToken(issueData?.token)}</span>
                      <span className="opacity-0 group-hover:opacity-100">{issueData?.token}</span>
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
                      {history?.length === 0 && <p className="text-sm text-center opacity-75">No history yet.</p>}
                      {history?.length > 0 && (
                        <ul className="space-y-2 p-2 overflow-y-auto max-h-60">
                          {history?.map((row: IssueHistory) => (
                            <li key={row.id} className="text-xs p-2 rounded bg-gray-100 flex items-center gap-2">
                              <span className="flex flex-col text-right border-r pr-2 border-gray-600 font-bold">
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
                      <div className="flex items-center gap-2 mt-2 ">
                        <p className="text-sm">created: {moment(issueData?.createdAt).format('MM/DD/YY [at] h:mm a')}</p>
                        <p className="text-xs">({moment(issueData?.createdAt).fromNow()})</p>
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
                          value={issueData?.assignees?.map((a: any) => a.user) as []}
                          updateItem={() => null}
                        />
                      </div>
                    </div>
                  </div>
                </Dialog.Description>
                <div className="flex justify-end gap-6 mt-4">
                  <button disabled={imAlreadyAssigned} onClick={() => handleAssingToMe()} className="btn btn-primary">
                    Assign to me
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
        openModal={isConfirmOpen}
        onClose={() => handleReopen()}
        onConfirm={() => handleConfirm()}
        title="Close Issue"
        message="Are you sure you want to close this issueData?"
      />
    </>
  );
}
