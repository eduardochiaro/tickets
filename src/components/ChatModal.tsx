'use client';
import IssueExpanded from '@/models/IssueExpanded';
import useStaleSWR from '@/utils/staleSWR';
import { Dialog, Transition } from '@headlessui/react';
import { DocumentIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useEffect, useState, Fragment } from 'react';
import SpinnerIcon from '@/icons/Spinner';
import { useSession } from 'next-auth/react';
import ExtendedUser from '@/models/ExtendedUser';

export default function ChatModal({ showChatModal }: { showChatModal: any }) {
  const [issueData, setIssueData] = useState<IssueExpanded | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const {
    data: messages,
    mutate: mutateMessages,
    isLoading: isLoadingMessages,
  } = useStaleSWR(showChatModal ? `/api/issues/${showChatModal.id}/messages` : null);

  const user = session?.user as ExtendedUser;

  useEffect(() => {
    if (showChatModal) {
      setIssueData(showChatModal);
      setIsOpen(true);
    } else {
      setIssueData(null);
      setIsOpen(false);
    }
  }, [showChatModal]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const Message = ({ message }: { message: any }) => {
    if (parseInt(user?.id) === message.userId) {
      return (
        <div className="flex justify-end mb-4 gap-4">
          <div className="py-3 px-4 bg-green-400 rounded-bl-xl rounded-tl-xl rounded-br-xl text-white">{message.message}</div>
          <Image
            className="h-8 w-8 rounded-full ring-2 ring-gray-200 hover:ring-sky-400"
            src={message.user.image}
            alt={message.user.name}
            title={message.user.name}
            width={100}
            height={100}
          />
        </div>
      );
    }
    return (
      <div className="flex justify-start mb-4 gap-4">
        <Image
          className="h-8 w-8 rounded-full ring-2 ring-gray-200 hover:ring-sky-400"
          src={message.user.image}
          alt={message.user.name}
          title={message.user.name}
          width={100}
          height={100}
        />
        <div className="py-3 px-4 bg-gray-400 rounded-br-xl rounded-tr-xl rounded-bl-xl text-white">{message.message}</div>
      </div>
    );
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog onClose={() => handleClose()} className="relative z-30">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-3xl rounded-lg bg-white p-8">
              <h3 className="group text-xl flex items-center gap-1">
                <DocumentIcon className="h-4" />
                Issue &quot;{issueData?.title}&quot;
              </h3>
              <Dialog.Title className="text-3xl border-b pb-4 group">Chat</Dialog.Title>
              <Dialog.Description className="py-5 flex flex-col gap-4" as="div">
                {isLoadingMessages && (
                  <div className="flex items-center justify-center gap-2">
                    <SpinnerIcon className="animate-spin h-5 w-5" />
                    Loading
                  </div>
                )}
                {messages && messages.map((message: any) => <Message key={message.id} message={message} />)}
              </Dialog.Description>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
