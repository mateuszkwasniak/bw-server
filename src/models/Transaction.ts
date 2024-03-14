import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  Double,
} from "typeorm";

import {
  IsDecimal,
  IsDate,
  validateOrReject,
  isDecimal,
  IsNumber,
  isNumber,
} from "class-validator";
import { getIsInvalidMessage } from "../helper/validation-messages";
import { CategoryBudget } from "./CategoryBudget";
import { User } from "./User";

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("double precision")
  @IsNumber(undefined, {
    message: getIsInvalidMessage("Amount"),
  })
  amount: number;

  @Column()
  @IsDate({
    message: getIsInvalidMessage("Date"),
  })
  date: Date;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @ManyToOne(
    () => CategoryBudget,
    (categoryBudget) => categoryBudget.transactions
  )
  categoryBudget: CategoryBudget;

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
