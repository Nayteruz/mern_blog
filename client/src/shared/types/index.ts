import { ICurrentUser } from "@/app/store/slice/user/userSlice";

export interface IErrorServerData {
  message: string;
  status: number;
}

export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IFormData {
  username?: string;
  email?: string;
  password?: string;
  profilePicture?: string;
}

export type TFormData = {
  _id?: string;
  title: string;
  content: string;
  category: string;
  image: string;
};

export interface IFetchError {
  message: string;
}

export interface IPost {
  _id: string;
  category: string;
  content: string;
  image: string;
  slug: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface IFetchPosts {
  posts: IPost[];
  totalPosts: number;
  lastMonthPosts: number;
}

export interface IFetchUsers {
  users: ICurrentUser[];
  totalUsers: number;
  lastMonthUsers: number;
}

export interface IComment {
  _id: string;
  content: string;
  userId: string;
  postId: string;
  createdAt: string;
  updatedAt: string;
}
