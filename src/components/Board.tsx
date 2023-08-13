'use client';

import useStaleSWR from '@/utils/staleSWR';
import { CalendarIcon } from '@heroicons/react/20/solid';
import { Status } from '@prisma/client';
import moment from 'moment';

export default function Board({ slug }: { slug: string }) {
  const { data: issues, mutate, isLoading } = useStaleSWR(`/api/projects/${slug}/issues`);
  const { data: statues } = useStaleSWR(`/api/status`);

  return (
    <>
      <div className="px-4 md:px-10 py-4 md:py-7 grow flex flex-col">
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal ">Issues</p>
        <div className="grow flex gap-6 py-4 md:py-7">
          {statues &&
            statues.map((x: Status) => (
              <div key={x.id} className="rounded bg-gray-300 ring-1 ring-gray-400 p-3 w-80 flex flex-col gap-3">
                <h3 className="text-lg font-semibold">{x.title}</h3>
                {issues &&
                  issues
                    .filter((y: any) => y.statusId === x.id)
                    .map((y: any) => (
                      <div key={y.id} className="rounded bg-gray-200 ring-1 ring-gray-400 flex flex-col gap-2">
                        <div className="px-3 pt-3">
                          <div className="text-xs bg-green-300 rounded p-1 inline">{y.type.title}</div>
                        </div>
                        <h4 className="text-base font-semibold px-3">{y.title}</h4>
                        <div className="flex items-center justify-between gap-2 p-3">
                          <div className="bg-gray-900 text-white rounded px-2 py-1 text-xs flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            <span>{moment(y.createdAt).format('ddd, MMM YY')}</span>
                          </div>
                          <div className="opacity-50">rest</div>
                        </div>
                      </div>
                    ))}
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
