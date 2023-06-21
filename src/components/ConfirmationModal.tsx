"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";

type ConfirmationModalProps = {
  openModal: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
};

export default function ConfirmationModal({ openModal, onClose, onConfirm, title, message }: ConfirmationModalProps) {

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    console.log(openModal)
    if (openModal) {
      setIsOpen(true);
    }
  }, [openModal]);

  const closeModal = () => {
    onClose();
    setIsOpen(false);
  };

  const confirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={closeModal}>
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

            <Dialog.Panel className="w-full max-w-5xl rounded-lg bg-white p-8">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                {title}
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  {message}
                </p>
              </div>

              <div className="mt-4 flext justify-between items-center">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  No
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={confirm}
                >
                  Confirm!
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}