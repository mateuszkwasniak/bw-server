import { FastifyPluginCallback, FastifySchema } from "fastify";
import { IIdParams, IDeleteReply } from "./types/generic.types";
import { idParamsSchema } from "./schemas/generic.schemas";
import { Budget } from "../models/Budget";
import { IBudgetsReply, IBudgetReply, IBudgetBody } from "./types/budget.types";
import { budgetBodySchema } from "./schemas/budget.schemas";

// route controllery nie musza byc owiniete fastify-plugin!!!

export const budgetController: FastifyPluginCallback = (
  server,
  undefined,
  done
) => {
  //all budgets for the auth user
  server.get<{
    Reply: IBudgetsReply;
  }>(
    "/",
    {
      onRequest: [server.authenticate],
    },
    async (request, reply) => {
      try {
        const budgets = await Budget.find({
          where: {
            user: {
              id: request.user.id,
            },
          },
          relations: ["categoryBudgets"],
        });
        reply.code(200).send({ budgets });
      } catch (error) {
        throw new Error();
      }
    }
  );

  //pobieranie pojedynczego budgetu
  server.get<{
    Params: IIdParams;
    Reply: IBudgetReply;
  }>(
    "/:id",
    {
      schema: { ...idParamsSchema },
      onRequest: [server.authenticate],
    },
    async (request, reply) => {
      try {
        const budget = await Budget.findOne({
          where: { id: request.params.id, user: { id: request.user.id } },
          relations: ["categoryBudgets"],
        });
        if (budget) {
          reply.code(200).send({ budget });
        } else throw new Error("No budget found");
      } catch (error) {
        throw new Error();
      }
    }
  );

  //tworzenie budgetu
  server.post<{
    Body: IBudgetBody;
    Reply: IBudgetReply;
  }>(
    "/",
    { schema: { ...budgetBodySchema }, onRequest: [server.authenticate] },
    async (request, reply) => {
      try {
        //specyficznie ustalamy jak zapelnic pole user (userId po stronie bazy danych, mozemy jako user: request.user albo user: { id: request.user.id}, po stronie bazy danych obsluzy obie formy dodajac po prostu id do pola userId)
        const newBudget = await Budget.create<Budget>({
          month: new Date(request.body.budget.month),
          user: {
            id: request.user.id,
          },
        }).save();
        return reply.code(200).send({ budget: newBudget });
      } catch (error) {
        console.log(error);
        reply.code(500).send({
          error: "Not able to create new user, please try again later",
        });
      }
    }
  );

  //usuwanie
  server.delete<{
    Params: IIdParams;
  }>(
    "/:id",
    { schema: idParamsSchema, onRequest: [server.authenticate] },
    async (request, reply) => {
      try {
        await Budget.delete({
          id: request.params.id,
          user: { id: request.user.id },
        });

        reply.code(200).send({ message: "Deleted successfuly" });
      } catch (error) {
        console.log(error);
        reply
          .code(500)
          .send({ error: "Unable to delete a budget, please try again later" });
      }
    }
  );

  done();
};
