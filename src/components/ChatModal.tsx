'use client';
import IssueExpanded from '@/models/IssueExpanded';
import useStaleSWR from '@/utils/staleSWR';
import { Dialog, Transition } from '@headlessui/react';
import { DocumentIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useEffect, useState, Fragment, useRef } from 'react';
import SpinnerIcon from '@/icons/Spinner';
import { useSession } from 'next-auth/react';
import ExtendedUser from '@/models/ExtendedUser';
import moment from "moment";
import { convertToHTML } from '../utils/convertToHTML';

const AlwaysScrollToBottom = () => {
  const elementRef = useRef<null | HTMLDivElement>(null);
  useEffect(() => elementRef.current?.scrollIntoView());
  return <div ref={elementRef} />;
};

export default function ChatModal({ showChatModal, onClose }: { showChatModal: any, onClose: () => void }) {
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
    onClose();
  };

  const convertToHTML = (text: string) => {
    return text.trim().replace(/\n/g, "<br />");
  };

  const Message = ({ message }: { message: any }) => {
    if (parseInt(user?.id) === message.userId) {
      return (
        <div className="flex justify-end mb-4">
        <div className="flex flex-col">
          <div className="flex justify-between gap-1">
            <div className="text-xs pl-3">{moment(message.createdAt).fromNow()}</div>
            <div className="text-xs pr-5">{message.user.name}</div>
          </div>
          <div className="py-3 px-4 bg-green-600 rounded-bl-xl rounded-tl-xl rounded-br-xl text-white" dangerouslySetInnerHTML={{
            __html:convertToHTML(message.message)
          }}></div>
          </div>
          <Image
            className="h-8 w-8 rounded-full ring-2 ring-gray-200 hover:ring-sky-400 -ml-3 z-10"
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
      <div className="flex justify-start mb-4">
        <Image
          className="h-8 w-8 rounded-full ring-2 ring-gray-200 hover:ring-sky-400 -mr-3 z-10"
          src={message.user.image}
          alt={message.user.name}
          title={message.user.name}
          width={100}
          height={100}
        />
        <div className="flex flex-col">
          <div className="flex justify-between gap-1">
            <div className="text-xs pl-5">{message.user.name}</div>
            <div className="text-xs pr-3">{moment(message.createdAt).fromNow()}</div>
          </div>
          <div className="py-3 px-4 bg-gray-500 rounded-br-xl rounded-tr-xl rounded-bl-xl text-white" dangerouslySetInnerHTML={{
            __html:convertToHTML(message.message)
          }}></div>
        </div>
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
            <Dialog.Panel className="w-full max-w-3xl rounded-lg bg-white dark:bg-gray-800 p-8 my-20 h-3/4 flex flex-col">
              <h3 className="group text-xl flex items-center gap-1">
                <DocumentIcon className="h-4" />
                Chat
              </h3>
              <Dialog.Title className="text-3xl border-b border-gray-500 pb-4 group">{issueData?.title}</Dialog.Title>
              <Dialog.Description className="pt-5 grow flex flex-col gap-4 px-2 overflow-y-auto" as="div">
                {isLoadingMessages && (
                  <div className="flex items-center justify-center gap-2">
                    <SpinnerIcon className="animate-spin h-5 w-5" />
                    Loading
                  </div>
                )}
                {!isLoadingMessages && messages && messages.length === 0 && (
                  <div className="flex items-center justify-center opacity-50">
                    <p>No messages yet</p>
                  </div>
                )}
                {messages && messages.map((message: any) => <Message key={message.id} message={message} />)}
                <AlwaysScrollToBottom />
              </Dialog.Description>
              <div className="">
                bottom write in
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
