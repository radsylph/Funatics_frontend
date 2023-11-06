export interface newUser {
  name: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  repeat_password: string;
}

export interface existingUser {
  user_info: string;
  password: string;
}
