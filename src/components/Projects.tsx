'use client';

import useStaleSWR from '@/utils/staleSWR';
import { Project } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

export default function Projects() {
  const { data: projects, isLoading } = useStaleSWR('/api/projects');

  return (
    <div className="grid grid-cols-4 gap-4 mt-7 ">
      {projects?.map((project: Project) => (
        <div key={project.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="">
						<div className="relative h-48">
							<Image 
								src={'/project.jpg'}
								fill
								alt={project.title}
								className="object-cover"
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								/>
						</div>
						<div className="px-4 py-5 sm:px-6 mt-6">
							<h3 className="text-2xl leading-6 font-medium text-gray-900">{project.title}</h3>
							<p className="my-4 max-w-2xl text-sm text-gray-500">{project.description}</p>
							<div className="flex justify-end">
								<Link href={`/p/${project.slug}`} prefetch={false} className="btn btn-primary">
									View
								</Link>
							</div>
						</div>
          </div>
        </div>
      ))}
    </div>
  );
}
