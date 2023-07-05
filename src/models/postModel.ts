import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { IUser } from "./userModel.js";
import { IComment } from "./commentModel.js";

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
    },
    image: {
      type: String,
      required: [true, "Image is required!"],
    },
    author: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "Author is required!"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    likes: {
      type: [Types.ObjectId],
      ref: "User",
      default: [],
    },
    category: {
      type: String,
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
  { toJSON: { virtuals: true } } // Enable virtuals in toJSON output
);

const PostModel: IPostModel = mongoose.model<IPost, IPostModel>("Post", postSchema);

export default PostModel;
