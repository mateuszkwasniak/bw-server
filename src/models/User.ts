import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Unique,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
  OneToMany,
} from "typeorm";

import {
  Length,
  IsEmail,
  Matches,
  IsOptional,
  validateOrReject,
} from "class-validator";
import { getIsInvalidMessage } from "../helper/validation-messages";
import * as bcrypt from "bcrypt";
import { Category } from "./Category";
import { Budget } from "./Budget";
import { Transaction } from "./Transaction";

@Entity()
@Unique(["email"])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsEmail(undefined, {
    message: getIsInvalidMessage("Email"),
  })
  email: string;

  @Column()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: `${getIsInvalidMessage(
      "Password"
    )}. Use a password with at least 8 symbols, including letters and digits`,
  })
  password: string;

  @Column()
  @Length(1, 50, { message: getIsInvalidMessage("First Name") })
  firstName: string;

  @Column()
  @Length(1, 50, { message: getIsInvalidMessage("Last Name") })
  lastName: string;

  @Column({
    default: "USD",
  })
  @Length(3, 3, { message: getIsInvalidMessage("Currency") })
  @IsOptional()
  currency: string;

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @OneToMany(() => Budget, (budget) => budget.user)
  budgets: Budget[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  cachedPassword: string;

  @AfterLoad()
  cachePassword() {
    this.cachedPassword = this.password;
  }
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.cachedPassword !== this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }

  async isPasswordValid(enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
  }
}
