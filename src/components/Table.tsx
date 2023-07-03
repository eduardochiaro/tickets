'use client';

import { ChatBubbleLeftRightIcon, ListBulletIcon } from '@heroicons/react/24/solid';
import moment from 'moment';
import Image from 'next/image';
import React, { useState, useEffect, Fragment, use, useReducer } from 'react';
import SpinnerIcon from '@/icons/Spinner';
import useStaleSWR from '@/utils/staleSWR';
import shortToken from '@/utils/shortToken';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import classNames from '@/utils/classNames';

import {
  CheckCircleIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  EllipsisHorizontalCircleIcon,
  PauseCircleIcon,
  PlayCircleIcon,
} from '@heroicons/react/24/outline';
import ProjectActionFlowWithStatues from '@/models/ProjectActionFlowWithStatues';
import ChatModal from './ChatModal';
import { getItem, setItem } from '@/utils/localStorage';
import Link from 'next/link';

const paginateIssues = (issues: any, page_size: number, page_number: number) => {
  return issues.slice((page_number - 1) * page_size, page_number * page_size);
};

const page_size = 5;

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
      return 'p-2 px-3 rounded-lg bg-yellow-600 text-white';
    case 3:
      return 'p-2 px-3 rounded-lg bg-green-600 text-white';
    case 4:
      return 'p-2 px-3 rounded-lg bg-sky-600 text-white';
    default:
      return 'p-2 px-3 rounded-lg bg-gray-600 text-white';
  }
};

const statusIcon = (statusId: number) => {
  switch (statusId) {
    default:
      return <></>;
    case 1:
      return <PlayCircleIcon className="h-4 text-white" />;
    case 2:
      return <PauseCircleIcon className="h-4 text-white" />;
    case 3:
      return <CheckCircleIcon className="h-4 text-white" />;
    case 4:
      return <EllipsisHorizontalCircleIcon className="h-4 text-white" />;
  }
};

const sortOptions = [
  {
    id: 'latest',
    name: 'Latest',
  },
  {
    id: 'oldest',
    name: 'Oldest',
  },
];

const showOptions = [
  {
    id: 'open',
    name: 'Open',
  },
  {
    id: 'all',
    name: 'All',
  },
  {
    id: 'pending',
    name: 'Pending',
  },
  {
    id: 'unassigned',
    name: 'Unassigned',
  },
  {
    id: 'closed',
    name: 'Closed',
  },
];

export default function Table({ slug, actions, type }: { slug: string; actions: ProjectActionFlowWithStatues[]; type: string }) {
  const pathAPI = type == 'all' ? `/api/projects/${slug}/issues` : `/api/projects/${slug}/myissues`;
  const { data: issues, mutate, isLoading } = useStaleSWR(pathAPI);
  const [issuesSet, setIssuesSet] = useState<any>(null);
  const [triggerMutate, setTriggerMutate] = useState(false);
  const [showChatModal, setShowChatModal] = useState<any>(null);
  const [pagesCount, setPagesCount] = useState(0);
  const [page, setPage] = useState(1);
  const [sorting, updateSorting] = useReducer((state: any, action: any) => {
    switch (action.type) {
      case 'show':
        return { ...state, show: action.payload };
      case 'sort':
        return { ...state, sort: action.payload };
    }
  }, getItem(`${type}.sorting`) || { show: 'open', sort: 'latest' });

  useEffect(() => {
    setItem(`${type}.sorting`, sorting);
  }, [sorting, type]);

  useEffect(() => {
    if (issuesSet) {
      const pages = Math.ceil(issuesSet.length / page_size);
      setPagesCount(pages);
    }
  }, [issuesSet]);

  useEffect(() => {
    if (issues) {
      switch (sorting.show) {
        default:
        case 'open':
          const open = issues.filter((issue: any) => !issue.closed);
          setIssuesSet([...open]);
          break;
        case 'pending':
          const pending = issues.filter((issue: any) => issue.statusId === 2);
          setIssuesSet([...pending]);
          break;
        case 'all':
          setIssuesSet([...issues]);
          break;
        case 'closed':
          const closed = issues.filter((issue: any) => !!issue.closed);
          setIssuesSet([...closed]);
          break;
        case 'unassigned':
          const unassigned = issues.filter((issue: any) => issue.assignees.length === 0 && !issue.closed);
          setIssuesSet([...unassigned]);
      }
    }
  }, [issues, sorting.show]);

  useEffect(() => {
    if (triggerMutate) {
      mutate();
      setTriggerMutate(false);
    }
  }, [triggerMutate, mutate]);

  const sortByDate = (order: string) => {
    updateSorting({ type: 'sort', payload: order });
    const filted = sorting.show === 'all' ? issues : issuesSet;
    if (order === 'latest') {
      const sorted = filted.sort(compare('createdAt', 'desc'));
      setIssuesSet([...sorted]);
    } else {
      const sorted = filted.sort(compare('createdAt', 'asc'));
      setIssuesSet([...sorted]);
    }
  };

  const getSort = (sort: string) => {
    return sortOptions.filter((option) => option.id === sort)[0].name;
  };

  return (
    <>
      <div className="px-4 md:px-10 py-4 md:py-7">
        <div className="flex items-center justify-between">
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800">{type == 'all' ? 'Issues' : 'My Issues'}</p>
          <div className="relative py-3 px-4 flex items-center gap-1 text-sm font-medium leading-none text-gray-600 bg-gray-200 hover:bg-gray-300 cursor-pointer rounded">
            <Listbox value={sorting.sort} onChange={(e) => sortByDate(e)}>
              <Listbox.Button className="flex items-center gap-1">
                <span>Sort By:</span> {getSort(sorting.sort)}
              </Listbox.Button>
              <Transition
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Listbox.Options className="absolute top-10 right-0 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {sortOptions.map((option, index) => (
                    <Listbox.Option
                      key={index}
                      value={option.id}
                      className={({ active }) =>
                        `relative flex-nowrap cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-sky-100 text-sky-900' : 'text-gray-900'}`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block ${selected ? 'font-medium' : 'font-normal'}`}>{option.name}</span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-600">
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </Listbox>
          </div>
        </div>
      </div>
      <div className="py-4 md:py-7 px-4 md:px-8 xl:px-10 rounded-lg">
        <div className="sm:flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-8 text-sm">
            {showOptions.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => updateSorting({ type: 'show', payload: option.id })}
                className={`${sorting.show === option.id && 'active'} btn`}
              >
                {option.name}
              </button>
            ))}
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
              {!issuesSet ||
                (issuesSet.length <= 0 && (
                  <tr className="h-16">
                    <td colSpan={8} className="p-2 text-center ">
                      No issues found.
                    </td>
                  </tr>
                ))}
              {issuesSet &&
                paginateIssues(issuesSet, page_size, page).map((issue: any) => (
                  <tr className={classNames(issue.closed ? `bg-gray-200 opacity-70` : `bg-white `, `h-16 group`)} key={issue.id}>
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
                    <td className="whitespace-nowrap p-2 cursor-help" title={moment(issue.createdAt).format('MM/DD/YYYY hh:mma')}>
                      <div className="flex items-center gap-2">
                        <ListBulletIcon className="w-5 h-5 text-gray-600" />
                        <p className="text-sm leading-none text-gray-600">{moment(issue.createdAt).format('MM/DD/YY')}</p>
                      </div>
                      <p className="text-xs">{moment(issue.createdAt).fromNow()}</p>
                    </td>
                    <td className="whitespace-nowrap p-2">
                      <button onClick={() => setShowChatModal(issue)} className="flex items-center gap-2">
                        <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-600" />
                        <span className="text-sm leading-none text-gray-600">{issue._count.messages}</span>
                      </button>
                    </td>
                    <td className="whitespace-nowrap p-2">
                      <div className="flex items-center">
                        {!issue.closed && (
                          <p className={`text-sm leading-none flex items-center gap-2 ${statusColor(issue.statusId)}`}>
                            {statusIcon(issue.statusId)}
                            {issue.status.title}
                          </p>
                        )}
                        {issue.closed && <p className={`text-sm leading-none ${statusColor(0)}`}>Closed</p>}
                      </div>
                    </td>
                    <td className="whitespace-nowrap p-2 text-right pr-5">
                      <Link href={`/p/${slug}/i/${shortToken(issue.token)}`} prefetch={false} className="btn btn-gray">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {issuesSet && (
          <div className="flex items-stretch justify-center gap-2 mt-4">
            <span className="btn btn-small btn-secondary text-xs font-mono" onClick={() => setPage(1)}>
              <ChevronDoubleLeftIcon className="w-3 h-3" />
            </span>
            {[...Array(pagesCount)].map((_, i) => (
              <span
                key={i}
                className={classNames(`btn btn-small btn-secondary text-xs font-mono`, page == i + 1 ? `active` : ``)}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </span>
            ))}
            <span className="btn btn-small btn-secondary text-xs font-mono" onClick={() => setPage(pagesCount)}>
              <ChevronDoubleRightIcon className="w-3 h-3" />
            </span>
          </div>
        )}
      </div>
      <ChatModal showChatModal={showChatModal} />
    </>
  );
}
