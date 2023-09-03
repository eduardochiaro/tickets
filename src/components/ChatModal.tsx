'use client';
import IssueExpanded from '@/models/IssueExpanded';
import useStaleSWR from '@/utils/staleSWR';
import { Dialog, Transition } from '@headlessui/react';
import { DocumentIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useEffect, useState, Fragment, useRef, ChangeEvent } from 'react';
import SpinnerIcon from '@/icons/Spinner';
import { useSession } from 'next-auth/react';
import ExtendedUser from '@/models/ExtendedUser';
import moment from "moment";
import { convertToHTML } from '@/utils/convertToHTML';
import axios from "axios";
import classNames from '../utils/classNames';

const AlwaysScrollToBottom = () => {
  const elementRef = useRef<null | HTMLDivElement>(null);
  useEffect(() => elementRef.current?.scrollIntoView());
  return <div ref={elementRef} />;
};

export default function ChatModal({ showChatModal, onClose }: { showChatModal: any, onClose: () => void }) {
  const [issueData, setIssueData] = useState<IssueExpanded | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
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

  const handeChanges = (e: ChangeEvent<any>) => {
    setMessage(e.target.value);
  };

  const SendMessageAction = () => {
    if (message.length > 0) {
      axios.post(`/api/issues/${showChatModal.id}/messages`, {
        message: message,
      })
      .then((res) => {
        if (res.status === 200) {
          mutateMessages();
          setMessage('');
        }
      })
      .catch((err) => {
        console.log(err);
      });
    }
  };

  const Message = ({ message }: { message: any }) => {
    // if date is different from previous message, show date

    const isDifferentDate = (message: any) => {
      const index = messages.indexOf(message) > 0 ? messages.indexOf(message) - 1 : 0;
      if (index == 0) {
        return true;
      }
      const previousMessage = messages[index];
      if (previousMessage) {
        const previousMessageDate = moment(previousMessage.createdAt).format('DD/MM/YYYY');
        const currentMessageDate = moment(message.createdAt).format('DD/MM/YYYY');
        return previousMessageDate !== currentMessageDate;
      }
      return true;
    };

    return (
      <>
      {isDifferentDate(message) && (
        <div className="flex items-center justify-center mb-4">
          <hr className="border-dotted border-gray-500 grow" />
          <div className="text-xs px-2 py-1 rounded-full">
            {moment(message.createdAt).format('MMMM Do, YYYY')}
          </div>
          <hr className="border-dotted border-gray-500 grow" />
        </div>
      )}
      {(parseInt(user?.id) === message.userId) ? (
        <div className="flex justify-end mb-4 group">
          <div className="flex flex-col">
            <div className="flex justify-between gap-4">
              <div className="text-xs pl-3">
                <div className="group-hover:hidden">{moment(message.createdAt).fromNow()}</div>
                <div className="hidden group-hover:block">{moment(message.createdAt).format('MM/DD/YYYY h:mm:ss a')}</div>
              </div>
              <div className="text-xs pr-5">{message.user.name}</div>
            </div>
            <div className="py-3 px-4 bg-green-600 rounded-bl-xl rounded-tl-xl rounded-br-xl text-white" dangerouslySetInnerHTML={{
              __html: convertToHTML(message.message)
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
      ) : (
        <div className="flex justify-start mb-4 group">
          <Image
            className="h-8 w-8 rounded-full ring-2 ring-gray-200 hover:ring-sky-400 -mr-3 z-10"
            src={message.user.image}
            alt={message.user.name}
            title={message.user.name}
            width={100}
            height={100}
          />
          <div className="flex flex-col">
            <div className="flex justify-between gap-4">
              <div className="text-xs pl-5">{message.user.name}</div>
              <div className="text-xs pr-3">
                <div className="group-hover:hidden">{moment(message.createdAt).fromNow()}</div>
                <div className="hidden group-hover:block">{moment(message.createdAt).format('MM/DD/YYYY h:mm:ss a')}</div>
              </div>
            </div>
            <div className="py-3 px-4 bg-gray-500 rounded-br-xl rounded-tr-xl rounded-bl-xl text-white" dangerouslySetInnerHTML={{
              __html: convertToHTML(message.message)
            }}></div>
          </div>
        </div>
      )}
    </>
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
            <Dialog.Panel className="w-full max-w-3xl rounded-lg bg-white dark:bg-gray-800 my-20 h-3/4 flex flex-col">
              <h3 className="px-8 pt-8 group text-xl flex items-center gap-1">
                <DocumentIcon className="h-4" />
                Chat
              </h3>
              <Dialog.Title className="px-8 text-3xl border-b border-gray-500 pb-4 group">{issueData?.title}</Dialog.Title>
              <Dialog.Description className="p-8 grow flex flex-col gap-4 overflow-y-auto" as="div">
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
              <div className="px-8 py-2 border-t border-gray-500 flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-b-lg">
                <input type="text" className="grow p-2 focus:outline-none bg-transparent" placeholder="Type a message..." value={message} onChange={(e) => handeChanges(e) } />
                <button disabled={message.length <= 3} className={classNames(message.length <= 3 ? `text-gray-400` : `group text-green-600 hover:text-emerald-500`)} onClick={() => SendMessageAction() }>
                  <PaperAirplaneIcon className="h-7 w-7 transition-all group-hover:-rotate-[25deg]" />
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
