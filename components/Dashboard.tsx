"use client";

import { useState } from "react";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

import Heading from "@/components/common/Heading";
import Paragraph from "@/components/common/Paragraph";
import OpenChatImage from "@/public/assets/DappChat.png";
import Features from "@/components/Features";
import AccountModal from "@/components/ui/AccountModal";

const Dashboard = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <>
      <div className="home min-h-screen flex flex-col md:flex-row justify-center items-center md:space-y-12 md:space-x-[12] mt-20 md:mt-10">
        <div className="flex flex-col gap-4 mb-10 mx-5 md:mr-10">
          <Heading className="text-white text-5xl dark:text-white">
            Multi-chain <br /> decentralized <br /> messaging
          </Heading>
          <Paragraph className="max-w-md md:text-left text-gray-200">
            Message anyone from the blockchain anonymously.{" "}
            <span className="font-bold text-light-gold">OpenChat</span> is a
            decentralized protocol that allows wallet-to-wallet messaging
            powered by multi-chain interoperability.{" "}
          </Paragraph>
          <button
            onClick={() => setOpenModal((prev) => !prev)}
            className="rounded-xl w-1/2 md:self-start self-center text-white font-bold p-3 bg-teal-600 dark:bg-blue-600 hover:scale-105"
          >
            CREATE ACCOUNT
          </button>
        </div>

        {openModal && <AccountModal setOpenModal={setOpenModal} />}

        <div className="flex flex-row max-w-1xl md:max-w-5xl mx-10">
          <Image
            className="img-shadow rounded-xl"
            width={800}
            height={700}
            src={OpenChatImage}
            alt="Decentralized-Messaging"
            priority
          />
        </div>
      </div>
      <Heading className="flex justify-center my-5">Features</Heading>
      <div className="flex flex-col md:flex-row justify-center items-center">
        <Features />
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(Dashboard), { ssr: false });
