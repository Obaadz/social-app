import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { z } from "zod";
import bcrypt from "bcrypt";
import uniqueValidator from "mongoose-unique-validator";
import emailSchema from "../utils/validators/schema/emailSchema.js";
import generateHashedPassword from "../utils/generateHashedPassword.js";
import imageSchema from "../utils/validators/schema/imageSchema.js";
import { IPost } from "./postModel.js";
import HOBBIES from "../utils/hobbies.js";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  forgetCode: string;
  verificationCode: string;
  inActive: Date;
  hobbies: string[];
  followers: IUser[] | Types.ObjectId[];
  following: IUser[] | Types.ObjectId[];
  posts: IPost[] | Types.ObjectId[];
  image: string;
  comparePassword(password: string): Promise<boolean>;
  compareVerificationCode(verificationCode: string): boolean;
  compareForgetCode(forgetCode: string): boolean;
}

export interface IUserModel extends Model<IUser> {}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required!"],
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
      maxlength: [100, "Password cannot exceed 100 characters!"],
    },
    forgetCode: {
      type: String,
      minlength: [4, "Forget code must be exactly 4 digits long!"],
      maxlength: [4, "Forget code must be exactly 4 digits long!"],
    },
    verificationCode: {
      type: String,
      minlength: [4, "Verification code must be exactly 4 digits long!"],
      maxlength: [4, "Verification code must be exactly 4 digits long!"],
    },
    inActive: {
      type: Date,
      expires: process.env.INACTIVE_USERS_EXPIRES_SECONDS,
    },
    hobbies: {
      type: [String],
      enum: HOBBIES,
      default: [],
    },
    followers: {
      type: [Types.ObjectId],
      ref: "User",
      default: [],
    },
    following: {
      type: [Types.ObjectId],
      ref: "User",
      default: [],
    },
    posts: {
      type: [Types.ObjectId],
      ref: "Post",
      default: [],
    },
    image: {
      type: String,
      validate: [
        (value: string) => {
          try {
            imageSchema.parse(value);

            return true;
          } catch (err) {
            return false;
          }
        },
        "Invalid image url!",
      ],
    },
    __v: {
      type: Number,
      select: false,
    },
  },
  { toJSON: { virtuals: true }, id: false } // Enable virtuals in toJSON output
);

userSchema.plugin(uniqueValidator, { message: "There is another user with this email!" });

userSchema.pre<IUser>("save", async function (next) {
  try {
    const hashedPassword = await generateHashedPassword(this.password);

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

userSchema.virtual("compareVerificationCode").get(function (this: IUser) {
  return (verificationCode: string) => verificationCode === this.verificationCode;
});

userSchema.virtual("compareForgetCode").get(function (this: IUser) {
  return (forgetCode: string) => forgetCode === this.forgetCode;
});

const UserModel: IUserModel = mongoose.model<IUser, IUserModel>("User", userSchema);

export default UserModel;
