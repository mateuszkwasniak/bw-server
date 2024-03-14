import { FastifyPluginCallback } from "fastify";
import { IBudgetIdParams, IIdParams } from "./types/generic.types";
import {
  budgetIdParamsSchema,
  idParamsSchema,
} from "./schemas/generic.schemas";
import { Transaction } from "../models/Transaction";
import { transactionBodySchema } from "./schemas/transaction.schemas";
import {
  ITransactionsReply,
  IBudgetAndTransactionIdParams,
  ITransactionReply,
  ITransactionBody,
} from "./types/transaction.types";

export const transactionController: FastifyPluginCallback = (
  server,
  undefined,
  done
) => {
  //pobieranie tranzakcji dla konkretnego budgetu (miesiaca)
  server.get<{ Params: IBudgetIdParams; Reply: ITransactionsReply }>(
    "/:budgetId",
    { schema: { ...budgetIdParamsSchema }, onRequest: [server.authenticate] },
    async (request, reply) => {
      try {
        const transactions = await Transaction.find({
          where: {
            user: {
              id: request.user.id,
            },
            categoryBudget: {
              budget: {
                id: request.params.budgetId,
              },
            },
          },
        });

        reply.code(200).send({ transactions });
      } catch (error) {
        console.log(error);
        reply.code(500).send({
          error: "Not able to retrieve transactions, please try again later",
        });
      }
    }
  );

  //pobieranie jednej tranzakcji dla konkretnego budgetu (miesiaca)
  server.get<{
    Params: IBudgetAndTransactionIdParams;
    Reply: ITransactionReply;
  }>(
    "/:budgetId/:id",
    { schema: { ...budgetIdParamsSchema }, onRequest: [server.authenticate] },
    async (request, reply) => {
      try {
        const transaction = await Transaction.findOne({
          where: {
            user: {
              id: request.user.id,
            },
            id: request.params.id,
            categoryBudget: {
              budget: {
                id: request.params.budgetId,
              },
            },
          },
        });

        reply.code(200).send({ transaction });
      } catch (error) {
        console.log(error);
        reply.code(500).send({
          error: "Not able to retrieve transactions, please try again later",
        });
      }
    }
  );

  server.post<{
    Body: ITransactionBody;
    Reply: ITransactionReply;
  }>(
    "/",
    { schema: { ...transactionBodySchema }, onRequest: [server.authenticate] },
    async (request, reply) => {
      try {
        console.log(request.body.transaction.amount);
        const newTransaction = await Transaction.create<Transaction>({
          date: new Date(request.body.transaction.date),
          amount: request.body.transaction.amount,
          user: {
            id: request.user.id,
          },
          categoryBudget: {
            id: request.body.transaction.categoryBudgetId,
          },
        }).save();

        return reply.code(200).send({ transaction: newTransaction });
      } catch (error) {
        console.log(error);
        reply
          .code(500)
          .send({ error: "Unable to add transaction, please try again later" });
      }
    }
  );

  server.put<{
    Body: ITransactionBody;
    Reply: ITransactionReply;
  }>(
    "/",
    { schema: { ...transactionBodySchema }, onRequest: [server.authenticate] },
    async (request, reply) => {
      try {
        await Transaction.update<Transaction>(
          {
            id: request.body.transaction.id,
            user: {
              id: request.user.id,
            },
          },
          request.body.transaction
        );

        const updatedTransaction = await Transaction.findOneBy({
          id: request.body.transaction.id,
          user: {
            id: request.user.id,
          },
        });
        return reply.code(200).send({ transaction: updatedTransaction });
      } catch (error) {
        console.log(error);
        return reply
          .code(500)
          .send({ error: "Not able to update the transaction." });
      }
    }
  );

  server.delete<{ Params: IIdParams }>(
    "/:id",
    { schema: { ...idParamsSchema }, onRequest: [server.authenticate] },
    async (request, reply) => {
      try {
        await Transaction.delete({
          id: request.params.id,
          user: {
            id: request.user.id,
          },
        });

        return reply
          .code(200)
          .send({ message: "Transaction deleted successfuly" });
      } catch (error) {
        console.log(error);
        return reply.code(500).send({
          error: "Not able to delete the transaction, please try again later",
        });
      }
    }
  );

  done();
};
