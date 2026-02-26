import { Profile } from '../../../types/profiles.types';

export type PostPayloadData = {
  title: string;
  content: string;
  authorId: number;
  communityId: number;
};

export type Post = {
  id: number;
  title: string;
  communityId: number;
  content: string;
  author: Profile;
  images: [string];
  createdAt: string;
  updatedAt: string;
  likes: number;
  likesUsers: [string];
  comments: [];
};
