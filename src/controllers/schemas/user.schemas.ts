import { FastifySchema } from "fastify";
import { notFoundAndErrorBasicProps } from "./generic.schemas";

const basicUserProps = {
  id: { type: "number" },
  email: { type: "string" },
  firstName: { type: "string" },
  lastName: { type: "string" },
  currency: { type: "string" },
};

export const userResponseSchema: FastifySchema = {
  //zeby byc super dokladni powinnismy definiowac tez odpowiedz dla naszego routu, ale robienie tego recznie jest mega nieefektywne. Chyba sa do tego jakies narzedzia bo ogolnie takie definiowanie jest bardzo pomocne, fastify zwroci tylko te pola ktore umiescimy w response, dodatkowo mozliwe jest tworzenia automatycznej dokumentacji na podstawie schemy

  response: {
    200: {
      type: "object",
      properties: {
        user: {
          type: "object",
          properties: basicUserProps,
        },
      },
    },
    ...notFoundAndErrorBasicProps,
  },
};

export const userBodySchema: FastifySchema = {
  body: {
    type: "object",
    required: ["user"],
    properties: {
      user: {
        type: "object",
        properties: {
          ...basicUserProps,
          password: { type: "string" },
        },
      },
    },
  },
};

export const userLoginResponseSchema: FastifySchema = {
  response: {
    200: {
      type: "object",
      properties: {
        token: { type: "string" },
      },
    },
    ...notFoundAndErrorBasicProps,
  },
};
