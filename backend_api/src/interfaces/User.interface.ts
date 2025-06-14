export enum UserType {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface IUser {
  _id?: string;
  name: string;
  username: string;
  email: string;
  password: string;
  profilePicture: {
    url: string;
    publicId: string | null;
  };
  bio: string;
  role: UserType;
  active: boolean;
  followers: string[];
  following: string[];
}

export interface IUserDocument extends IUser, Document {}

export interface IUserUpdate {
  firstName?: string;
  lastName?: string;
}
