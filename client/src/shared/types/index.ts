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
