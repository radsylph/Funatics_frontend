export interface newUser {
  name: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  repeat_password: string;
  profilePicture: string | undefined;
  captchaResponse: string | undefined;
  _id?: any;
  bio?: string;
}

export interface existingUser {
  user_info: string;
  password: string;
  email?: string;
}

export interface userProfile {
  name: string;
  lastname: string;
  username: string;
  email?: string;
  profilePicture: string | undefined;
  _id: string;
  bio?: string;
  followers?: any;
  following?: number;
  isFollowing?: boolean;
  createdAt?: any;
}
