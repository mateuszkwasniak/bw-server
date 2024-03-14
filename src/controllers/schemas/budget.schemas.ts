import { FastifySchema } from "fastify";

export const budgetResponseSchema: FastifySchema = {
  response: {
    200: {
      type: "object",
      properties: {
        budget: {
          type: "object",
          properties: {
            id: { type: "number" },
            month: { type: "string" },
          },
        },
      },
    },
  },
};

export const budgetBodySchema: FastifySchema = {
  body: {
    type: "object",
    required: ["budget"],
    properties: {
      budget: {
        type: "object",
        properties: {
          month: { type: "string" },
        },
      },
    },
  },
};
