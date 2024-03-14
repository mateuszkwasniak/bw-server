import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./models/User";
import { Budget } from "./models/Budget";
import { Transaction } from "./models/Transaction";
import { CategoryBudget } from "./models/CategoryBudget";
import { Category } from "./models/Category";
import config from "./config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.postgres.host,
  port: config.postgres.port,
  username: config.postgres.username,
  password: config.postgres.password,
  database: config.postgres.database,
  synchronize: true,
  logging: false,
  entities: [User, Budget, Transaction, CategoryBudget, Category],
});
