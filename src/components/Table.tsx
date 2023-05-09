'use client';

import { ChatBubbleLeftRightIcon, ListBulletIcon } from "@heroicons/react/24/outline";
import moment from 'moment';
import Image from "next/image";
import useSWR from 'swr';
import React, { useState, useEffect } from 'react';

const fetcher = (url: URL) => fetch(url).then((res) => res.json());

export default function Table({ slug } : { slug: string }) {
	const { data, error, isLoading } = useSWR(`/api/projects/${slug}/issues`, fetcher)
  const [dataset, setDataset] = useState<any>(null);

  useEffect(() => {
    if (data) {
      setDataset(data);
    }
  }, [data]);

  const onClickPending = () => {
    const pending = data.filter((issue: any) => issue.statusId === 2);
    setDataset(pending);
  };

  const onClickAll = () => {
    setDataset(data);
  };

  const onClickDone = () => {
    const done = data.filter((issue: any) => issue.closed === true);
    setDataset(done);
  };
  return (
    <>
      <div className="px-4 md:px-10 py-4 md:py-7">
        <div className="flex items-center justify-between">
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800">Issues</p>
          <div className="py-3 px-4 flex items-center text-sm font-medium leading-none text-gray-600 bg-gray-200 hover:bg-gray-300 cursor-pointer rounded">
            <p>Sort By:</p>
            <select className="focus:outline-none bg-transparent ml-1">
              <option className="text-sm text-indigo-800">Latest</option>
              <option className="text-sm text-indigo-800">Oldest</option>
            </select>
          </div>
        </div>
      </div>
      <div className="py-4 md:py-7 px-4 md:px-8 xl:px-10 rounded-lg">
        <div className="sm:flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-8 text-sm">
            <button type="button" onClick={() => onClickAll()} className="group font-medium tracking-wide select-none text-sm relative inline-flex items-center justify-center cursor-pointer border-2 border-solid py-1 px-6 rounded-md overflow-hidden z-10 transition-all duration-300 ease-in-out outline-0 bg-blue-500 text-white border-blue-500">
              All
            </button>
            <button type="button" onClick={() => onClickDone()} className="group font-medium tracking-wide select-none text-sm relative inline-flex items-center justify-center cursor-pointer border-2 border-solid py-1 px-6 rounded-md overflow-hidden z-10 transition-all duration-300 ease-in-out outline-0 border-blue-300">
              Done
            </button>
            <button type="button" onClick={() => onClickPending()} className="group font-medium tracking-wide select-none text-sm relative inline-flex items-center justify-center cursor-pointer border-2 border-solid py-1 px-6 rounded-md overflow-hidden z-10 transition-all duration-300 ease-in-out outline-0 border-blue-300">
              Pending
            </button>
          </div>
        </div>
        <div className="mt-7 rounded-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr className="h-12 w-full text-sm leading-none text-gray-800">
                <th className="font-semibold text-left p-2"></th>
                <th className="font-semibold text-left p-2">Issue</th>
                <th className="font-semibold text-left p-2">Assigned to</th>
                <th className="font-semibold text-left p-2">Type</th>
                <th className="font-semibold text-left p-2">Created</th>
                <th className="font-semibold text-left p-2">Chat</th>
                <th className="font-semibold text-left p-2">Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 bg-gray-50">
              {!dataset || dataset.length <= 0 && (
              <tr className="h-16">
                <td colSpan={8} className="p-2 text-center ">
                  No issues found.
                </td>
              </tr>
              )}
              {dataset && dataset.map((issue: any) => (
              <tr className="h-16" key={issue.id}>
                <td className="grow">
                  <div className="ml-5">

                  </div>
                </td>
                <td className="w-1/2 p-2">
                  <div className="flex items-center gap-2">
                    <p className="text-base font-medium leading-none text-gray-700">{issue.title}</p>
                  </div>
                </td>
                <td className="whitespace-nowrap p-2">
                {issue.assignee && (
                <div className="flex -space-x-2 overflow-hidden">
                  {issue.assignee.map((assignee: any) => (
                  <div key={assignee.user.id} className="inline-block relative">
                    <Image
                      className="h-8 w-8 rounded-full ring-2 ring-white"
                      src={assignee.user.image}
                      alt={assignee.user.name}
                      title={assignee.user.name}
                      width={100}
                      height={100}
                    />
                  </div>
                  ))}
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
                    <p className="text-sm leading-none text-gray-600">{moment(issue.createdAt).format("MM/DD/YY") }</p>
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
                    <p className="text-sm leading-none text-gray-600">{issue.status.title}</p>
                  </div>
                </td>
                <td className="whitespace-nowrap p-2 text-right pr-5">
                  <button className="text-sm leading-none text-gray-600 py-3 px-5 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none">View</button>
                </td>
              </tr>
              ))}
              
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
