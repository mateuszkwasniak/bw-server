import { User } from "../../models/User";

interface IBasicNotFoundAndErrorReply {
  404: {
    message: string;
  };
  500: {
    error: string;
  };
}

export interface IUserReply extends IBasicNotFoundAndErrorReply {
  200: {
    user: Partial<User>;
  };
}

export interface IUserBody {
  user: Partial<User>;
}

export interface IUserLoginReply extends IBasicNotFoundAndErrorReply {
  200: {
    token: string;
  };
}
