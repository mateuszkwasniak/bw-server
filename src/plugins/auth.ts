import { FastifyPluginCallback, FastifyReply, FastifyRequest } from "fastify";
import { fastifyPlugin } from "fastify-plugin";
import fastifyJwt = require("@fastify/jwt");
import config from "../config";
import { User } from "../models/User";

//w ten sposob informuje TypeScript ze rozszerzamy interferjs FastifyInstance o nowa metode authenticate (zobacz plugin function)
declare module "fastify" {
  export interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}

//tutaj musimy dodac info dla typescirptu ze na obiekcie request bedzie obiekt user pochodzacy ze zdekodowanego JWT...

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: Partial<User>;
  }
}

//ta plugin function zawiera konfiguracje plugina, ktora jest dodawana przez metode register w jest z metod App:
const authPlugin: FastifyPluginCallback = (server, undefined, done) => {
  server.register(fastifyJwt, {
    secret: config.jwt.secret,
  });

  server.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      try {
        await request.jwtVerify();
      } catch (error) {
        reply.send(error);
      }
    }
  );

  done();
};

// Wrapping a plugin function with fastify-plugin exposes the decorators
// and hooks, declared inside the plugin to the parent scope.
export default fastifyPlugin(authPlugin);
