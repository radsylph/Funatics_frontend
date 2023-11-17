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
}

export interface existingUser {
  user_info: string;
  password: string;
}

export interface userProfile {
  name: string;
  lastname: string;
  username: string;
  email?: string;
  profilePicture: string;
  _id: string;
  bio?: string;
  followers?: number;
  following?: number;
}
