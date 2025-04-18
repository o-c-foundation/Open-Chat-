export type FriendListType = {
  name: string;
  friendkey: string;
};

export type MessagesType = {
  content: string;
  sender: string;
  timestamp: string;
};

export interface UserList {
  name: string;
  accountAddress: string;
}

export interface InitialStateInterface {
  isLoading: boolean;
  account: string;
  username: string;
  friendList: FriendListType[];
  messages: MessagesType[];
  userList: UserList[];
  blockedUsers: string[];
  checkMetamask: boolean;
  setCurrentUser: React.Dispatch<React.SetStateAction<string>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  currentUser: string;
  connectWallet: () => Promise<void> | "";
  setMessages: React.Dispatch<React.SetStateAction<MessagesType[]>>;
  createAccount: ({ name, marketingOptIn }: { name: string, marketingOptIn?: boolean }) => Promise<void> | "";
  getUserMessages: (address: string) => Promise<void> | [];
  getUsername: (address: string) => Promise<string | undefined> | "";
  handleSendMessage: ({
    content,
    address,
  }: {
    content: string;
    address: string;
  }) => Promise<void> | "";
  handleAddFriend: ({
    address,
    name,
  }: {
    address: string;
    name: string;
  }) => Promise<void> | "";
  handleBlockUser: (address: string) => Promise<void> | "";
  handleUnblockUser: (address: string) => Promise<void> | "";
  checkIncomingFriendRequests: () => Promise<string[]> | [];
}

export const initialState: InitialStateInterface = {
  isLoading: false,
  checkMetamask: false,
  account: "",
  username: "",
  friendList: [],
  messages: [],
  userList: [],
  blockedUsers: [],
  currentUser: "",
  setMessages: () => "",
  setCurrentUser: () => "",
  input: "",
  setInput: () => "",
  connectWallet: () => "",
  createAccount: () => "",
  getUserMessages: () => [],
  getUsername: () => "",
  handleSendMessage: () => "",
  handleAddFriend: () => "",
  handleBlockUser: () => "",
  handleUnblockUser: () => "",
  checkIncomingFriendRequests: () => [],
};
