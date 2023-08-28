'use client';

import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import shortToken from '@/utils/shortToken';
import Image from 'next/image';
import classNames from '@/utils/classNames';

export default function SearchBar({ slug, trigger }: { slug: string; trigger?: boolean }) {
  const [searchText, setSearchText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [issues, setIssues] = useState([]);
  const [team, setTeam] = useState([]);

  // show bar when command+k is pressed
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.metaKey && e.key === 'k') {
      e.preventDefault();
      setShowSearch(false);
      setIsOpen(true);
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
  });
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };
  useEffect(() => {
    setShowSearch(false);
    const callIssueApi = async (slug: string, searchText: string) => {
      const result = await fetch(`/api/projects/${slug}/issues?search=${searchText}`)
        .then((res) => res.json())
        .then((data) => data);
      setIssues(result);
      setShowSearch(true);
    };

    const callTeamApi = async (slug: string, searchText: string) => {
      const result = await fetch(`/api/projects/${slug}/team?search=${searchText}`)
        .then((res) => res.json())
        .then((data) => data);
      setTeam(result);
      setShowSearch(true);
    };

    const timer = setTimeout(() => {
      if (searchText.length >= 3) {
        callIssueApi(slug, searchText);
        callTeamApi(slug, searchText);
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [searchText, slug]);

  useEffect(() => {
    if (trigger) {
      setIsOpen(true);
    }
  }, [trigger]);

  const resetSearch = () => {
    setSearchText('');
    setShowSearch(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-gray-950/70 backdrop-blur-sm" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 p-32 flex flex-col">
        {/* The actual dialog panel  */}
        <Dialog.Panel className="mx-auto flex flex-col min-h-0 w-1/2 rounded bg-white dark:bg-gray-800 ring-1 ring-gray-100 dark:ring-gray-700">
          <div className="flex place-items-center gap-4 p-2 ">
            <MagnifyingGlassIcon className="h-7" />
            <input
              value={searchText}
              name="search"
              className="h-10 border-0 text-xl bg-transparent focus:outline-0 grow"
              placeholder="...search in project"
              onChange={(e) => onChange(e)}
            />
            <div className="px-2 h-7 flex items-center text-xs bg-gray-100 dark:bg-gray-700 rounded">esc</div>
          </div>
          {showSearch && (
            <div className="flex flex-col gap-4 bg-gray-100 dark:bg-gray-900 p-4 rounded-b border-t border-gray-100 dark:border-gray-700">
              {team.length == 0 && issues.length == 0 && (
                <div className="flex flex-col items-center justify-center gap-4">
                  <p className="text-xl font-semibold">No results found</p>
                  <p className="text-sm">Try adjusting your search to find what you are looking for.</p>
                </div>
              )}
              {issues.length > 0 && (
                <>
                  <h3 className="font-sans text-xl font-semibold">Issues</h3>
                  <ul
                    role="listbox"
                    className="flex flex-col divide-y -mx-4 divide-gray-100 dark:divide-gray-700 border-t border-b border-gray-100 dark:border-gray-700"
                  >
                    {issues.map((issue: any, index) => (
                      <li
                        role="option"
                        aria-selected={false}
                        className={classNames(
                          issue.closed ? 'line-through' : '',
                          `hover:bg-gray-100 hover:dark:bg-gray-700 focus-within:bg-gray-100 focus-within:dark:bg-gray-700`,
                        )}
                        key={issue.id}
                      >
                        <Link href={`/p/${slug}/i/${shortToken(issue.token)}`} className="block p-3 px-5" onClick={() => resetSearch()}>
                          <p>{issue.title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Status: <strong>{issue.closed ? 'Closed' : issue.status.title}</strong>
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {team.length > 0 && (
                <>
                  <h3 className="font-sans text-xl font-semibold">Team</h3>
                  <ul
                    role="listbox"
                    className="flex flex-col divide-y -mx-4 divide-gray-100 dark:divide-gray-700 border-t border-b border-gray-100 dark:border-gray-700"
                  >
                    {team.map((member: any) => (
                      <li
                        role="option"
                        aria-selected={false}
                        className=" hover:bg-gray-100 hover:dark:bg-gray-700 focus-within:bg-gray-100 focus-within:dark:bg-gray-700"
                        key={member.user.id}
                      >
                        <Link href={`/p/${slug}/u/${member.user.username}`} className="flex items-center gap-2 p-3 px-5" onClick={() => resetSearch()}>
                          <Image src={member.user.image} width={24} height={24} alt={member.user.name} className="w-5 h-5 rounded-full" />
                          {member.user.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
