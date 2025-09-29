import { Profile } from '../../../types/profiles.types';

export type SubscribersPagination = {
  items: Profile[];
  page: number;
  pages: number;
  size: number;
  total: number;
};
