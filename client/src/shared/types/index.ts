export interface IErrorServerData {
  message: string;
  status: number;
}

export interface IFormData {
  username?: string;
  email?: string;
  password?: string;
  profilePicture?: string;
}

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
