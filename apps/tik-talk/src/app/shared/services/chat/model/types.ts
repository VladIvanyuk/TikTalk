import { Profile } from '../../../types/profiles.types';

export type ChatMessage = {
  id: number;
  userFrom: Profile;
  message: string;
  createdAt: string;
  unreadMessages: number;
};

export type Chat = {
  id: number;
  userFirst: Profile;
  userSecond: Profile;
  messages: ChatMessage[];
};
