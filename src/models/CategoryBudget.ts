import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  OneToMany,
  AfterInsert,
  AfterLoad,
  AfterUpdate,
} from "typeorm";

import { IsDecimal, IsDate, validateOrReject, IsNumber } from "class-validator";
import { getIsInvalidMessage } from "../helper/validation-messages";
import { Category } from "./Category";
import { Budget } from "./Budget";
import { Transaction } from "./Transaction";

@Entity()
export class CategoryBudget extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("double precision")
  @IsNumber(undefined, {
    message: getIsInvalidMessage("Amount"),
  })
  amount: number;

  @ManyToOne(() => Category, (category) => category.categoryBudgets)
  category: Category;

  @ManyToOne(() => Budget, (budget) => budget.categoryBudgets)
  budget: Budget;

  @OneToMany(() => Transaction, (transaction) => transaction.categoryBudget, {
    eager: true,
  })
  transactions: Transaction[];

  //pomocnicze pole ktore nie wystepuje w bazie danych i jest automatycznie wyliczane po kazdym zaladowaniu rekordu itd.
  currentAmount: number;

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  generateCurrentAmount(): void {
    if (!this.transactions) return;
    this.currentAmount = this.transactions.reduce(
      (acc, currValue) => acc + currValue.amount,
      0
    );
  }
}
