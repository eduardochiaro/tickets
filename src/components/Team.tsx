"use client";
import useStaleSWR from '@/utils/staleSWR';
import Image from "next/image";
import { Fragment } from "react";


export default function Team({ slug }: { slug: string; }) {
  const { data: roles } = useStaleSWR('/api/roles');
  const { data: team, isLoading } = useStaleSWR(`/api/projects/${slug}/team`);

  return (      
    <div className="px-4 md:px-10 py-4 md:py-7">
      <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800">Team</p>
      <div className="px-10">
      { roles?.map((role: any) => (
        <Fragment key={role.id}>
          <h2 className="text-xl font-semibold mt-10">{role.title}</h2>
          <div className="flex flex-wrap items-stretch gap-8 mt-4">
            {team?.filter((member: any) => member.roleId === role.id).map((member: any) => (
            <div key={member.userId} className="rounded-lg ring-1 ring-black ring-opacity-5 hover:ring-opacity-20 overflow-hidden bg-gray-50 flex flex-col gap-4">
              <div className="flex items-center">
                <Image
                  className="h-18 w-18"
                  src={member.user.image}
                  alt={member.user.name}
                  title={member.user.name}
                  width={100}
                  height={100}
                />
                <div className="flex flex-col gap-4 p-4">
                <h3 className="text-lg font-semibold">{member?.user.name}</h3>
                <p className="text-sm">{member?.user.email}</p>
                </div>
              </div>
            </div>
            ))}
          </div>
        </Fragment>
      ))}
      </div>
      
    </div>
  );
}