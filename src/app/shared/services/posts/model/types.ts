import { Profile } from '../../../types/profiles.types';

export type PostPayloadData = {
  title: string;
  content: string;
  authorId: number;
  communityId: number;
};

export type CommentPayloadData = {
  text: string;
  authorId: number;
  postId: number;
  commentId?: number;
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
  comments: Comment[];
};

export type Comment = {
  id: number;
  text: string;
  author: Profile;
  postId: number;
  commentId: number;
  createdAt: string;
  updatedAt: string;
};
