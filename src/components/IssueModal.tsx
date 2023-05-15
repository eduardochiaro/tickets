import { Issue, Status, Type, User } from '@prisma/client';
import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import useStaleSWR from '../utils/staleSWR';

type IssueModalProps = {
  issue: Issue & {
    assignees: User[];
  } | null;
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
        <Dialog.Panel className="w-full max-w-2xl rounded-lg bg-white p-8">
          <Dialog.Title className="text-3xl border-b-2 mb-2">Issue</Dialog.Title>
          <p className="text-xl font-semibold">{issue?.title}</p>
          <p className="text-sm font-semibold">code: {issue?.token}</p>
          <Dialog.Description className="py-5" as="div">
            <div className="grid grid-cols-2 gap-4">
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
                <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500">
                  {issue?.assignees?.map((a: any) => (
                    <div key={a.user.id} className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-pink-600 bg-pink-200">
                      {a.user.name}
                    </div>
                  ))}
                </div>
              </div>
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
