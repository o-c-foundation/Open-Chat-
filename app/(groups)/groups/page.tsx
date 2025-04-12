import { Metadata } from "next";
import GroupChatUI from "@/components/GroupChatUI";

export const metadata: Metadata = {
  title: "OpenChat | Group Chats",
  description: "Join group conversations on the blockchain",
};

export default function GroupsPage() {
  return (
    <div className="min-h-screen pt-16">
      <GroupChatUI />
    </div>
  );
} 