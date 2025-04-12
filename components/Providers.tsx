"use client";

import { ThemeProvider } from "next-themes";
import { ChatProvider } from "@/context/DappChat.context";
import { GroupChatProvider } from "@/context/GroupChat.context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <ChatProvider>
        <GroupChatProvider>
          {children}
        </GroupChatProvider>
      </ChatProvider>
    </ThemeProvider>
  );
}
