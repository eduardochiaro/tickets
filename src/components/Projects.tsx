'use client';

import useStaleSWR from '@/utils/staleSWR';
import { Project } from '@prisma/client';
import Link from 'next/link';

export default function Projects() {
  const { data: projects, isLoading } = useStaleSWR('/api/projects');

  return (
    <div className="grid grid-cols-4 gap-4 mt-7 ">
      {projects?.map((project: Project) => (
        <div key={project.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">{project.title}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{project.description}</p>
            <Link href={`/p/${project.slug}`} prefetch={false} className="text-indigo-600 hover:text-indigo-900">
              View
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
