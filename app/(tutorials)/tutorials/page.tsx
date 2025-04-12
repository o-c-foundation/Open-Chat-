import HowItWorks from "@/components/HowItWorks";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "OpenChat | How It Works",
  description:
    "Learn how our decentralized messaging application works on testnet networks",
};

const page = () => {
  return (
    <div className="min-h-screen">
      <HowItWorks />
    </div>
  );
};
export default page;
