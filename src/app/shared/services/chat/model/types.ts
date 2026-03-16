import { Profile } from '../../../types/profiles.types';

export type ChatMessage = {
  id: number;
  userFromId: number;
  text: string;
  createdAt: string;
  unreadMessages: number;
};

export type Chat = {
  id: number;
  userFirst: Profile;
  userSecond: Profile;
  messages: ChatMessage[];
  companion: Profile;
};

export type MyChatList = {
  id: number;
  userFrom: Profile;
  message: string;
  createdAt: string;
  unreadMessages: number;
};
