import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { IUser } from "./userModel.js";
import { IComment } from "./commentModel.js";
import imageSchema from "../utils/validators/schema/imageSchema.js";
import CATEGORIES from "../utils/categories.js";
import loadEnvironment from "../utils/loadEnvironment.js";
import moment from "moment";

loadEnvironment();

export interface IPost extends Document {
  caption: string;
  image: string;
  author: IUser | Types.ObjectId;
  createdAt: Date;
  likes: IUser[] | Types.ObjectId[];
  category: string;
  comments: IComment[] | Types.ObjectId[];
}

export interface IPostModel extends Model<IPost> {}

const postSchema: Schema<IPost> = new mongoose.Schema(
  {
    caption: {
      type: String,
      maxlength: [
        Number(process.env.MAX_POST_CAPTION_LENGTH),
        `Max post length cannot exceed ${process.env.MAX_POST_CAPTION_LENGTH} characters!`,
      ],
      default: "",
    },
    image: {
      type: String,
      required: [true, "Image is required!"],
      validate: [
        (value: string) => {
          try {
            imageSchema.parse(value);

            return true;
          } catch (err) {
            return false;
          }
        },
        "Invalid url for image!",
      ],
    },
    author: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "Author is required!"],
    },
    likes: {
      type: [Types.ObjectId],
      ref: "User",
      default: [],
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: [true, "Category is required!"],
    },
    comments: {
      type: [Types.ObjectId],
      ref: "Comment",
      default: [],
    },
    __v: {
      type: Number,
      select: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.createdAt;
      },
    },
    id: false,
    timestamps: { createdAt: true, updatedAt: false },
  }
);

postSchema.virtual("createdFrom").get(function (this: IPost) {
  const currentTime = moment();
  const pastTime = moment(this.createdAt);

  return pastTime.from(currentTime);
});

const PostModel: IPostModel = mongoose.model<IPost, IPostModel>("Post", postSchema);

export default PostModel;
