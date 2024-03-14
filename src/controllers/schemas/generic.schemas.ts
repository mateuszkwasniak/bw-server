import { FastifySchema } from "fastify";

export const notFoundAndErrorBasicProps = {
  404: {
    type: "object",
    properties: {
      message: {
        type: "string",
      },
    },
  },
  500: {
    type: "object",
    properties: {
      error: {
        type: "string",
      },
    },
  },
};

export const idParamsSchema: FastifySchema = {
  params: {
    id: { type: "number" },
  },
};

export const budgetIdParamsSchema: FastifySchema = {
  params: {
    budgetId: { type: "number" },
  },
};

export const deleteResponseSchema: FastifySchema = {
  response: {
    200: {
      type: "object",
      properties: {
        message: {
          type: "string",
        },
      },
    },
    ...notFoundAndErrorBasicProps,
  },
};
