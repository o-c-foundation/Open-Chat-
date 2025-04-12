import React from "react";

interface NavItems {
  label: string;
  page: string;
}

export const navLinks: NavItems[] = [
  {
    label: "Home",
    page: "/",
  },
  {
    label: "Discover",
    page: "users",
  },
  {
    label: "Chat",
    page: "chat",
  },
  {
    label: "Groups",
    page: "groups",
  },
  {
    label: "Group Chat",
    page: "groups/chat",
  },
  {
    label: "Tutorials",
    page: "tutorials",
  },
  {
    label: "Documentation",
    page: "https://openchat-docs.gitbook.io/openchat-technical-documentation/",
  },
];
