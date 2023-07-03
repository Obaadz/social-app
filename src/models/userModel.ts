import mongoose, { Document, Model, Schema } from "mongoose";
import { z } from "zod";
import bcrypt from "bcrypt";
import uniqueValidator from "mongoose-unique-validator";
import generateRandomNumber from "../utils/generateRandomNumber";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  forgetCode: string;
  verificationCode: String;
  inActiveUserExpires: Date;
  comparePassword(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUser> {}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required!"],
      lowercase: true,
      trim: true,
      minlength: [3, "Full name must be at least 3 characters long!"],
      maxlength: [15, "Full name cannot exceed 15 characters!"],
      match: [/^[A-Za-z\s]+$/, "Full name should contain only letters and spaces!"],
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      lowercase: true,
      trim: true,
      maxlength: [100, "Email cannot exceed 100 characters!"],
      unique: true,
      validate: [
        (value: string) => {
          try {
            const emailSchema = z.string().email();

            emailSchema.parse(value);

            return true;
          } catch (err) {
            return false;
          }
        },
        "Invalid email format!",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      minlength: [6, "Password must be at least 6 characters long!"],
      maxlength: [100, "password cannot exceed 100 characters!"],
    },
    forgetCode: {
      code: {
        type: String,
        minlength: [6, "Forget code must be exactly 6 characters long!"],
        maxlength: [6, "Forget code must be exactly 6 characters long!"],
        required: true,
      },
      expiresAt: {
        type: Date,
        required: true,
      },
    },
    verificationCode: {
      type: String,
      minlength: [6, "Verification code must be exactly 6 characters long!"],
      maxlength: [6, "Verification code must be exactly 6 characters long!"],
      default: () => generateRandomNumber(6),
    },
    inActiveUserExpires: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true } } // Enable virtuals in toJSON output
);

userSchema.plugin(uniqueValidator, { message: "There is another user with this email!" });

userSchema.pre<IUser>("save", async function (next) {
  try {
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(this.password, saltRounds);

    this.password = hashedPassword;

    next(); // Save operation will continue after hashing the password
  } catch (error) {
    next(error); // Pass the error to handle it appropriately
  }
});

userSchema.virtual("comparePassword").get(function (this: IUser) {
  return async (password: string) => {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      throw new Error("Error while comparing passwords");
    }
  };
});

userSchema.index(
  { unActiveExpires: 1 },
  { expireAfterSeconds: Number(process.env.INACTIVE_USERS_EXPIRES_SECONDS) }
);

const UserModel: IUserModel =
  mongoose.models.User || mongoose.model<IUser, IUserModel>("User", userSchema);

export default UserModel;
