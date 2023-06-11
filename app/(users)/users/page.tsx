import Users from "@/components/Users";

type Metadata = {
  title: string;
  description: string;
};

export const metadata: Metadata = {
  title: "ChatDapp | Users",
  description: "A multi-chain decentralized messaging application ",
};

const page = () => {
  return (
    <>
      <Users />
    </>
  );
};
export default page;
