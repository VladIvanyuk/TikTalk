import { Profile } from '../../../types/profiles.types';

export type SubscribersPagination = {
  items: Profile[];
  page: number;
  pages: number;
  size: number;
  total: number;
};

export type UserUpdateData = {
  firstName: string;
  lastName: string;
  // stack: [string];
  // city: string;
  description: string;
};
