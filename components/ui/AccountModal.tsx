"use client";
import { useState, FC, SetStateAction } from "react";
import Link from "next/link";

import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Loading from "@/components/common/Loading";
import Heading from "@/components/common/Heading";

import { useChatContext } from "@/context/DappChat.context";

interface ModalProps {
  setOpenModal: React.Dispatch<SetStateAction<boolean>>;
}

const AccountModal: FC<ModalProps> = ({ setOpenModal }) => {
  const [name, setName] = useState<string>("");
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [marketingOptIn, setMarketingOptIn] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");

  const { account, isLoading, createAccount } = useChatContext();

  const handleCreateAccount = () => {
    if (!termsAccepted) {
      setFormError("You must accept the Terms of Service to create an account");
      return;
    }
    
    setFormError("");
    createAccount({ name, marketingOptIn });
  };

  return (
    <div className="fixed backdrop-blur-sm inset-0 flex items-center justify-center bg-opacity-0 z-50">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="bg-gray-800 text-white rounded-lg p-6 sm:p-8 mx-4 sm:mx-auto w-full max-w-md">
          <Heading size="sm" className="text-2xl font-bold mb-4">
            Create Your Account
          </Heading>
          <div className="mb-4">
            <label htmlFor="username" className="block font-medium">
              Username
            </label>
            <Input
              type="text"
              id="username"
              className="w-full text-black dark:text-white border-gray-300 dark:border-gray-600 outline-none py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="walletAddress" className="block font-medium">
              Wallet Address
            </label>
            <Input
              type="text"
              id="walletAddress"
              className="w-full border-gray-300 text-slate-500 dark:border-gray-600 outline-none py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm"
              readOnly
              value={account}
            />
          </div>
          
          {/* Terms of Service Agreement */}
          <div className="mb-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-300">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-400 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-400 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>
          </div>
          
          {/* Marketing Opt-in */}
          <div className="mb-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="newsletter"
                  type="checkbox"
                  checked={marketingOptIn}
                  onChange={() => setMarketingOptIn(!marketingOptIn)}
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="newsletter" className="text-gray-300">
                  I want to receive updates and marketing emails about new features and announcements
                </label>
              </div>
            </div>
          </div>
          
          {/* Error message */}
          {formError && (
            <div className="mb-4 p-2 bg-red-500/20 border border-red-500/50 rounded text-sm text-red-200">
              {formError}
            </div>
          )}
          
          <div className="flex justify-end">
            <Button
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-md mr-2 hover:scale-105"
              onClick={() => setOpenModal((prev) => !prev)}
              label="Cancel"
            />
            <Button
              className="px-4 py-2 text-sm font-medium text-white bg-teal-600 dark:bg-blue-600 rounded-md hover:scale-105"
              disabled={!account || !name}
              onClick={handleCreateAccount}
              label="Register"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountModal;
