import React from "react";

interface NavItems {
  label: string;
  page: string;
}

export const navLinks: NavItems[] = [
  {
    label: "Users",
    page: "users",
  },
  {
    label: "Chat",
    page: "chat",
  },
  {
    label: "Tutorials",
    page: "tutorials",
  },
];
