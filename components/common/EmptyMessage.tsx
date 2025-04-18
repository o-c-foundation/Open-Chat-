import Heading from "@/components/common/Heading";
import Paragraph from "@/components/common/Paragraph";
import OpenChatLogo from "@/public/assets/openchat-logo.png";
import Image from "next/image";

const EmptyMessage = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="my-10">
        <Heading size="sm">
          Welcome to Open<span className="text-light-gold">Chat</span>!
        </Heading>
      </div>
      <Image
        src={OpenChatLogo}
        alt="OpenChat Logo"
        className="rounded-full"
        height={200}
        width={200}
      />
      <div className="rounded-md flex flex-col ">
        <div className="border rounded-lg border-slate-600 p-3 bg-white mt-3">
          <Paragraph className="text-slate-500">
            <span className="text-light-gold">OpenChat</span> is a multi-chain
            and fully on-chain decentralized messaging platform for users to
            simply and instantly message each other, wallet-to-wallet.
          </Paragraph>
        </div>
        <div className="border rounded-lg border-slate-600 p-3 bg-white mt-3">
          <Paragraph className="text-slate-500">
            Never share your private keys to anyone!
          </Paragraph>
        </div>
        <div className="border rounded-lg border-slate-600 p-3 bg-white mt-3">
          <Paragraph className="text-slate-500">Happy Chatting!</Paragraph>
        </div>
      </div>
    </div>
  );
};

export default EmptyMessage;
