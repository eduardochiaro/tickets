'use client';

import { ChatBubbleLeftRightIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import SpinnerIcon from '@/icons/Spinner';
import IssueModal from './IssueModal';
import useStaleSWR from '@/utils/staleSWR';
import shortToken from '@/utils/shortToken';

function compare(key: any, order = 'asc') {
  return function innerSort(a: { [x: string]: any }, b: { [x: string]: any }) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === 'desc' ? comparison * -1 : comparison;
  };
}
const statusColor = (statusId: number) => {
  switch (statusId) {
    case 2:
      return 'p-1 rounded bg-yellow-100 text-yellow-800';
    case 3:
      return 'p-1 rounded bg-green-100 text-green-800';
    case 4:
      return 'p-1 rounded bg-sky-100 text-sky-800';
    default:
      return 'p-1 rounded bg-gray-100 text-gray-800';
  }
};

export default function Table({ slug, type }: { slug: string; type: string }) {
  const pathAPI = type == 'all' ? `/api/projects/${slug}/issues` : `/api/projects/${slug}/myissues`;
  const { data: issues, mutate, isLoading } = useStaleSWR(pathAPI);
  const [issuesset, setDataset] = useState<any>(null);
  const [activeButton, setActiveButton] = useState<string>('all');
  const [currentIssue, setCurrentIssue] = useState<any>(null);

  useEffect(() => {
    if (issues) {
      setDataset([...issues]);
    }
  }, [issues]);

  const onClickPending = () => {
    const pending = issues.filter((issue: any) => issue.statusId === 2);
    setDataset([...pending]);
    setActiveButton('pending');
  };

  const onClickAll = () => {
    setDataset([...issues]);
    setActiveButton('all');
  };

  const onClickDone = () => {
    const done = issues.filter((issue: any) => issue.closed === true);
    setDataset([...done]);
    setActiveButton('done');
  };

  const sortByDate = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const order = event.target.value;
    const filted = activeButton === 'all' ? issues : issuesset;
    if (order === 'latest') {
      const sorted = filted.sort(compare('createdAt', 'desc'));
      setDataset([...sorted]);
    } else {
      const sorted = filted.sort(compare('createdAt', 'asc'));
      setDataset([...sorted]);
    }
  };

  return (
    <>
      <div className="px-4 md:px-10 py-4 md:py-7">
        <div className="flex items-center justify-between">
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800">{type == 'all' ? 'Issues' : 'My Issues'}</p>
          <div className="py-3 px-4 flex items-center text-sm font-medium leading-none text-gray-600 bg-gray-200 hover:bg-gray-300 cursor-pointer rounded">
            <p>Sort By:</p>
            <select className="focus:outline-none bg-transparent ml-1" onChange={(e) => sortByDate(e)}>
              <option className="text-sm text-indigo-800" value={`latest`}>
                Latest
              </option>
              <option className="text-sm text-indigo-800" value={`oldest`}>
                Oldest
              </option>
            </select>
          </div>
        </div>
      </div>
      <div className="py-4 md:py-7 px-4 md:px-8 xl:px-10 rounded-lg">
        <div className="sm:flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-8 text-sm">
            <button type="button" onClick={() => onClickAll()} className={`${activeButton === 'all' && 'active'} btn`}>
              All
            </button>
            <button type="button" onClick={() => onClickDone()} className={`${activeButton === 'done' && 'active'} btn`}>
              Done
            </button>
            <button type="button" onClick={() => onClickPending()} className={`${activeButton === 'pending' && 'active'} btn`}>
              Pending
            </button>
          </div>
        </div>
        <div className="mt-7 rounded-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr className="h-12 w-full text-sm leading-none text-gray-800">
                <th className="font-semibold text-left p-2 pl-5">ID</th>
                <th className="font-semibold text-left p-2">Issue</th>
                <th className="font-semibold text-left p-2 whitespace-nowrap">Assigned to</th>
                <th className="font-semibold text-left p-2">Type</th>
                <th className="font-semibold text-left p-2">Created</th>
                <th className="font-semibold text-left p-2">Chat</th>
                <th className="font-semibold text-left p-2">Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 bg-gray-50">
              {isLoading && (
                <tr className="h-16">
                  <td colSpan={8} className="p-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <SpinnerIcon className="animate-spin h-5 w-5" />
                      Loading
                    </div>
                  </td>
                </tr>
              )}
              {!issuesset ||
                (issuesset.length <= 0 && (
                  <tr className="h-16">
                    <td colSpan={8} className="p-2 text-center ">
                      No issues found.
                    </td>
                  </tr>
                ))}
              {issuesset &&
                issuesset.map((issue: any) => (
                  <tr className="h-16 group" key={issue.id}>
                    <td className="p-2">
                      <div className="ml-3 opacity-60 group-hover:opacity-100 font-mono text-sm">{shortToken(issue?.token)}</div>
                    </td>
                    <td className="w-full p-2">
                      <div className="flex items-center gap-2">
                        <p className="text-base font-medium leading-none text-gray-700">{issue.title}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap p-2">
                      {issue.assignees && (
                        <div className="flex -space-x-3">
                          {issue.assignees.slice(0, 3).map((assignee: any) => (
                            <div key={assignee.user.id} className="inline-block relative z-10 hover:z-30 whitespace-nowrap w-8">
                              <Image
                                className="h-8 w-8 rounded-full ring-2 ring-gray-200 hover:ring-sky-400"
                                src={assignee.user.image}
                                alt={assignee.user.name}
                                title={assignee.user.name}
                                width={100}
                                height={100}
                              />
                            </div>
                          ))}
                          {issue.assignees.length > 3 && (
                            <div className="inline-block relative w-8 z-10 hover:z-30">
                              <p
                                title={`${issue.assignees.length - 3} more assignee(s)`}
                                className="absolute bottom-0 left-0 w-5 h-5 flex items-center text-[0.6rem] bg-sky-400 rounded-full p-1 text-white ring-2 ring-white"
                              >
                                +{issue.assignees.length - 3}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap p-2">
                      <div className="flex items-center gap-2">
                        <p className="text-sm leading-none text-gray-600">{issue.type.title}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap p-2">
                      <div className="flex items-center gap-2">
                        <ListBulletIcon className="w-5 h-5 text-gray-600" />
                        <p className="text-sm leading-none text-gray-600">{moment(issue.createdAt).format('MM/DD/YY')}</p>
                      </div>
                      <p className="text-xs">{moment(issue.createdAt).fromNow()}</p>
                    </td>
                    <td className="whitespace-nowrap p-2">
                      <div className="flex items-center gap-2">
                        <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-600" />
                        <p className="text-sm leading-none text-gray-600">23</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap p-2">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm leading-none ${statusColor(issue.statusId)}`}>{issue.status.title}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap p-2 text-right pr-5">
                      <button onClick={() => setCurrentIssue(issue)} className="btn btn-gray">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <IssueModal issue={currentIssue} onClose={() => null} />
    </>
  );
}
