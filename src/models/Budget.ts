import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  ManyToOne,
} from "typeorm";

import { IsDate, validateOrReject } from "class-validator";
import { getIsInvalidMessage } from "../helper/validation-messages";
import { CategoryBudget } from "./CategoryBudget";
import { User } from "./User";

@Entity()
export class Budget extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsDate({
    message: getIsInvalidMessage("Month"),
  })
  month: Date;

  @OneToMany(() => CategoryBudget, (categoryBudget) => categoryBudget.budget)
  categoryBudgets: CategoryBudget[];

  @ManyToOne(() => User, (user) => user.budgets)
  user: User;

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
