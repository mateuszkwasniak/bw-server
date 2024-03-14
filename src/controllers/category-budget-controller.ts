import { FastifyPluginCallback } from "fastify";
import {
  IDeleteReply,
  IIdParams,
  ISuccessfulUpdateReply,
} from "./types/generic.types";
import {
  deleteResponseSchema,
  idParamsSchema,
} from "./schemas/generic.schemas";
import { CategoryBudget } from "../models/CategoryBudget";
import { Category } from "../models/Category";

interface ICategoryBudgetReply {
  200: {
    categoryBudget: Partial<CategoryBudget>;
  };
  404: {
    message: string;
  };
  500: {
    error: string;
  };
}

interface ICategoryBudgetBody {
  categoryBudget: Partial<CategoryBudget>;
}

export const categoryBudgetController: FastifyPluginCallback = (
  server,
  undefined,
  done
) => {
  server.get<{ Params: IIdParams; Reply: ICategoryBudgetReply }>(
    "/:id",
    {
      schema: { ...idParamsSchema },
      onRequest: [server.authenticate],
    },
    async (request, reply) => {
      try {
        const categoryBudget = await CategoryBudget.findOne({
          where: {
            id: request.params.id,
            budget: {
              user: {
                id: request.user.id,
              },
            },
          },
        });

        return reply.code(200).send({ categoryBudget });
      } catch (error) {
        console.log(error);
        return reply.code(500).send({
          error: "Unable to find the category budget, please try again later",
        });
      }
    }
  );

  //ten route mocno opiera sie na podejrzewam featurze typeorm, ze do rekordu odwolujemy sie poprzez jego id.
  server.post<{
    Body: ICategoryBudgetBody;
    Reply: ICategoryBudgetReply;
  }>("/", { onRequest: [server.authenticate] }, async (request, reply) => {
    try {
      let category: Partial<Category>;

      if (!request.body.categoryBudget.category?.id) {
        //jezeli nie ma jeszcze Category to tworzymy przed dodaniem category budget category...ufajac ze user przeslal wszystko co konieczne poza id...hmmmm...sredniawka
        category = await Category.create({
          ...request.body.categoryBudget.category,
          user: {
            id: request.user.id,
          },
        }).save();
      } else {
        category = { id: request.body.categoryBudget.category.id };
      }
      const newCategoryBudget = await CategoryBudget.create<CategoryBudget>({
        ...request.body.categoryBudget,
        category,
      }).save();

      return reply.code(200).send({ categoryBudget: newCategoryBudget });
    } catch (error) {
      console.log(error);
      reply.code(500).send({
        error: "Not able to create new category budget, please try again later",
      });
    }
  });

  //put ...
  server.put<{
    Body: ICategoryBudgetBody;
    Reply: ISuccessfulUpdateReply;
  }>("/", { onRequest: [server.authenticate] }, async (request, reply) => {
    try {
      let category: Partial<Category>;

      if (
        request.body.categoryBudget?.category &&
        !request.body.categoryBudget?.category?.id
      ) {
        category = await Category.create({
          ...request.body.categoryBudget.category,
          user: {
            id: request.user.id,
          },
        }).save();
      } else if (request.body.categoryBudget?.category?.id) {
        category = { id: request.body.categoryBudget.category.id };
      }

      const updatedCategoryBudget =
        await CategoryBudget.findOneBy<CategoryBudget>({
          id: request.body.categoryBudget.id,
        });

      if (!updatedCategoryBudget) {
        return reply.code(404).send({
          message: "No Category Budget found",
        });
      } else {
        const result = await CategoryBudget.update<CategoryBudget>(
          request.body.categoryBudget.id,
          {
            ...request.body.categoryBudget,
            category: category?.id
              ? {
                  id: category?.id,
                }
              : { id: updatedCategoryBudget.id },
          }
        );

        return reply.code(200).send({ message: "Updated." });
      }
    } catch (error) {
      console.log(error);
      reply.code(500).send({
        error: "Not able to create new category budget, please try again later",
      });
    }
  });

  server.delete<{ Params: IIdParams; Reply: IDeleteReply }>(
    "/:id",
    {
      schema: { ...idParamsSchema, ...deleteResponseSchema },
      onRequest: [server.authenticate],
    },
    async (request, reply) => {
      try {
        const toBeDeleted = await CategoryBudget.findOne({
          where: {
            id: request.params.id,
            category: {
              user: {
                id: request.user.id,
              },
            },
          },
        });

        await CategoryBudget.delete({
          id: toBeDeleted.id,
        });

        return reply.code(200).send({ message: "Category Budget deleted." });
      } catch (error) {
        console.log(error);
        reply.code(500).send({
          error: "Unable to delete category budget, please try again later",
        });
      }
    }
  );

  done();
};
