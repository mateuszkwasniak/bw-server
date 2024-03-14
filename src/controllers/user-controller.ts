import { FastifyPluginCallback, FastifySchema } from "fastify";
import { User } from "../models/User";
import { IIdParams, IDeleteReply } from "./types/generic.types";
import { IUserReply, IUserBody, IUserLoginReply } from "./types/user.types";
import {
  idParamsSchema,
  deleteResponseSchema,
} from "./schemas/generic.schemas";
import {
  userBodySchema,
  userLoginResponseSchema,
  userResponseSchema,
} from "./schemas/user.schemas";

// route controllery nie musza byc owiniete fastify-plugin!!!
export const userController: FastifyPluginCallback = (
  server,
  undefined,
  done
) => {
  server.get<{
    Params: IIdParams;
    Reply: IUserReply;
  }>(
    "/:id",
    {
      schema: { ...idParamsSchema, ...userResponseSchema },
      onRequest: [server.authenticate],
    },
    async (request, reply) => {
      try {
        const user = await User.findOneBy({ id: request.params.id });
        if (!user) {
          reply.code(404).send({ message: "No user found." });
        }
        reply.code(200).send({ user });
      } catch (error) {
        console.log(error);
        reply
          .code(500)
          .send({ error: "Service not available, please try again later." });
      }
    }
  );

  server.post<{
    Body: IUserBody;
    Reply: IUserReply;
  }>(
    "/",
    { schema: { ...userBodySchema, ...userResponseSchema } },
    async (request, reply) => {
      try {
        const newUser = await User.create<User>(request.body.user).save();
        return reply.code(200).send({ user: newUser });
      } catch (error) {
        console.log(error);
        reply.code(500).send({
          error: "Not able to create new user, please try again later",
        });
      }
    }
  );

  //logowanie

  server.post<{
    Body: IUserBody;
    Reply: IUserLoginReply;
  }>(
    "/login",
    {
      schema: { ...userBodySchema, ...userLoginResponseSchema },
    },
    async (request, reply) => {
      try {
        const user = await User.findOneBy({ email: request.body.user.email });
        if (!user) {
          return reply.code(404).send({ message: "User not found." });
        } else {
          const isPasswordValid = await user.isPasswordValid(
            request.body.user.password
          );
          if (!isPasswordValid) {
            return reply
              .code(404)
              .send({ message: "Invalid email or password" });
          } else {
            const token = server.jwt.sign(user);
            return reply.code(200).send({ token });
          }
        }
      } catch (error) {
        console.log(error);
        return reply.code(500).send({
          error: "Service not available, please try loggin in later.",
        });
      }
    }
  );

  //ten route nie jest perfekcyjny, nie walidujemy czy uzytkownik updatuje samego siebie, czy na bank istnieje w bazie danych user z takim id jak przekazane, czy w ogole id zostalo przekazane w requescie...na bank nie stosowac na produkcji! xD
  server.put<{ Body: IUserBody; Reply: IUserReply }>(
    "/",
    {
      schema: { ...userBodySchema, ...userResponseSchema },
      onRequest: [server.authenticate],
    },
    async (request, reply) => {
      try {
        await User.update<User>(request.body.user.id, request.body.user);

        const updatedUser = await User.findOneBy({ id: request.body.user.id });
        return reply.code(200).send({ user: updatedUser });
      } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "Not able to update the user." });
      }
    }
  );

  //tutaj tez nie jest to super metoda z dokladnie tych samych przyczyn co wyzej, metoda delete tak jak i put nie sprawdza czy dany rekord istnieje w bazie danych
  server.delete<{
    Params: IIdParams;
    Reply: IDeleteReply;
  }>(
    "/:id",
    {
      schema: { ...idParamsSchema, ...deleteResponseSchema },
      onRequest: [server.authenticate],
    },
    async (request, reply) => {
      try {
        await User.delete({ id: request.params.id });
        return reply.code(200).send({ message: "User deleted successfuly" });
      } catch (error) {
        return reply.code(500).send({
          error: "Not able to delete the user, please try again later",
        });
      }
    }
  );

  done();
};
