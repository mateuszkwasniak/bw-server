import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  OneToMany,
  Double,
} from "typeorm";

import {
  IsDecimal,
  IsDate,
  validateOrReject,
  Length,
  IsEnum,
  IsNumber,
  IsOptional,
} from "class-validator";
import { getIsInvalidMessage } from "../helper/validation-messages";
import { User } from "./User";
import { CategoryBudget } from "./CategoryBudget";

export enum CategoryType {
  INCOME = 0,
  EXPENSE = 1,
  SAVINGS = 2,
  DEBT = 3,
}

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: CategoryType,
  })
  @IsEnum(CategoryType, {
    message: getIsInvalidMessage("Type"),
  })
  type: CategoryType;

  @Column()
  @Length(1, 50, {
    message: getIsInvalidMessage("Title"),
  })
  title: string;

  @Column("double precision", { nullable: true })
  @IsNumber(undefined, {
    message: getIsInvalidMessage("Accumulated Amount"),
  })
  @IsOptional()
  accAmount: number;

  @ManyToOne(() => User, (user) => user.categories)
  user: User;

  @OneToMany(() => CategoryBudget, (categoryBudget) => categoryBudget.category)
  categoryBudgets: CategoryBudget[];

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
