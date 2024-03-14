import { Transaction } from "../../models/Transaction";

export interface ITransactionsReply {
  200: {
    transactions: Partial<Transaction>[];
  };
  404: {
    message: string;
  };
  500: {
    error: string;
  };
}

export interface ITransactionReply {
  200: {
    transaction: Partial<Transaction>;
  };
  404: {
    message: string;
  };
  500: {
    error: string;
  };
}

export interface IBudgetAndTransactionIdParams {
  budgetId: number;
  id: number;
}

export interface ITransactionBody {
  transaction: Partial<Transaction> & { categoryBudgetId: number };
}
