export interface IIdParams {
  id: number;
}

export interface IBudgetIdParams {
  budgetId: number;
}

export interface IDeleteReply {
  200: {
    message: string;
  };
  404: {
    message: string;
  };
  500: {
    error: string;
  };
}

export interface ISuccessfulUpdateReply {
  200: {
    message: string;
  };
  404: {
    message: string;
  };
  500: {
    error: string;
  };
}
