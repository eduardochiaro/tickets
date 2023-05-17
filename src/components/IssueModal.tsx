import { Issue, Status, Type, User } from '@prisma/client';
import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import useStaleSWR from '../utils/staleSWR';
import Image from 'next/image';
import moment from 'moment';
import { XCircleIcon } from '@heroicons/react/24/solid';

type IssueModalProps = {
  issue:
    | (Issue & {
        assignees: User[];
        owner: User;
				shortToken: String;
      })
    | null;
  onClose: () => void;
};

export default function IssueModal({ issue, onClose }: IssueModalProps) {
  let [isOpen, setIsOpen] = useState(false);
  const { data: types } = useStaleSWR(`/api/types`);
  const { data: status } = useStaleSWR(`/api/status`);

  useEffect(() => {
    if (issue) {
      setIsOpen(true);
    }
  }, [issue]);
  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl rounded-lg bg-white p-8">
          <p>Issue</p>
          <Dialog.Title className="text-3xl border-b pb-4 group flex items-end gap-2">{issue?.title} 
					<span className="group-hover:hidden opacity-60 text-xl">#{issue?.shortToken}</span>
					<span className="hidden group-hover:inline opacity-60 text-xl">#{issue?.token}</span>
					</Dialog.Title>
          <Dialog.Description className="pb-5 grid grid-cols-3 gap-4" as="div">
            <div className="grid grid-cols-2 gap-4 col-span-2 pt-4 pr-4 border-r">
              <div className="col-span-2 p-4 bg-gray-200 text-sm">
                <h4 className="text-base font-semibold pb-2">Description</h4>
                {issue?.description}
              </div>
              <div className="flex flex-col">
                <label htmlFor="status" className="text-sm font-semibold">
                  Status
                </label>
                <select
                  disabled={true}
                  name="status"
                  onChange={() => null}
                  value={issue?.statusId}
                  className="border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                  {status?.map((s: Status) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="type" className="text-sm font-semibold">
                  Type
                </label>
                <select
                  disabled={true}
                  name="type"
                  onChange={() => null}
                  value={issue?.typeId}
                  className="border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                  {types?.map((s: Type) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col col-span-2">
                <label htmlFor="assignees" className="text-sm font-semibold">
                  Assignees
                </label>
                <div className="flex flex-wrap items-center gap-2 border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500">
                  {issue?.assignees?.map((a: any) => (
                    <div
                      key={a.user.id}
                      className="group relative text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-sky-600 bg-sky-200 flex-nowrap"
                    >
                      {a.user.name}
                      <button className="hidden group-hover:block absolute -top-2 -right-2 text-red-500 cursor-pointer">
                        <XCircleIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <div className="relative grow inline-block text-left">
                    <input className="w-full bg-transparent border-0 py-0 focus:ring-0 min-w-fit px-2" placeholder="Add assignee" onChange={() => null} />
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <h3 className="text-xl font-semibold mb-2">Owner</h3>
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
              <p className="mt-2 text-sm">created: {moment(issue?.createdAt).format('MM/DD/YY [at] h:mm a')}</p>
              <p className="text-xs">({moment(issue?.createdAt).fromNow()})</p>
            </div>
          </Dialog.Description>

          <button onClick={() => setIsOpen(false)} className="btn">
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
