import { FastifySchema } from "fastify";

export const transactionBodySchema: FastifySchema = {
  body: {
    type: "object",
    required: ["transaction"],
    properties: {
      transaction: {
        type: "object",
        properties: {
          amount: { type: "number" },
          date: { type: "string" },
          categoryBudgetId: { type: "number" },
        },
      },
    },
  },
};
