export interface TweetInterface {
  _id: string;
  title: string;
  content: string;
  owner: {
    profilePicture: string;
    _id: string;
    name: string;
    lastname: string;
    username: string;
  };
  likes: number;
  comments: number;
  image: string;
  edited: boolean;
  isComment: boolean;
  PostToComment: string;
  createdAt: string;
  updatedAt: string;
  LikeToggleIcon?: any;
  isLiked?: boolean;
}

export interface CreateTweetInterface {
  title: string;
  content: string;
  image?: string;
}

