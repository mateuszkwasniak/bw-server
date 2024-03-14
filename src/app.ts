import { AppDataSource } from "./data-source";
import { User } from "./models/User";
import fastify, { FastifyInstance } from "fastify";
import config from "./config";
import { userController } from "./controllers/user-controller";
import auth from "./plugins/auth";
import { budgetController } from "./controllers/budget-controller";
import { transactionController } from "./controllers/transaction-controller";
import { categoryBudgetController } from "./controllers/category-budget-controller";

class Application {
  server: FastifyInstance;

  constructor() {
    this.server = fastify();
  }

  async startHttpServer() {
    const address = await this.server.listen({
      host: "0.0.0.0",
      port: config.port,
    });
    console.log("Server dziala i slucha na porcie " + address);
  }

  registerPlugins() {
    this.server.register(auth);
  }

  registerControllers() {
    this.server.register(userController, {
      prefix: `${config.apiPrefix}/users`,
    });
    this.server.register(budgetController, {
      prefix: `${config.apiPrefix}/budgets`,
    });
    this.server.register(transactionController, {
      prefix: `${config.apiPrefix}/transactions`,
    });
    this.server.register(categoryBudgetController, {
      prefix: `${config.apiPrefix}/category-budgets`,
    });
  }

  async main() {
    try {
      await AppDataSource.initialize();
      this.registerPlugins();
      this.registerControllers();
      await this.startHttpServer();
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
}

export default Application;
