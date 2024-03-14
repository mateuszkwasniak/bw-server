import { Budget } from "../../models/Budget";

export interface IBudgetsReply {
  200: {
    budgets: Partial<Budget>[];
  };
  404: {
    message: string;
  };
  500: {
    error: string;
  };
}

export interface IBudgetReply {
  200: {
    budget: Partial<Budget>;
  };
  404: {
    message: string;
  };
  500: {
    error: string;
  };
}

export interface IBudgetBody {
  budget: Partial<Budget>;
}
