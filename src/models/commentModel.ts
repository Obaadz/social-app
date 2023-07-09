import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { IUser } from "./userModel.js";
import { IPost } from "./postModel.js";

export interface IComment extends Document {
  content: string;
  author: IUser | Types.ObjectId;
  post: IPost | Types.ObjectId;
  createdAt: Date;
}

export interface ICommentModel extends Model<IComment> {}

const commentSchema: Schema<IComment> = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Content is required!"],
      trim: true,
    },
    author: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "Author is required!"],
    },
    post: {
      type: Types.ObjectId,
      ref: "Post",
      required: [true, "Post is required!"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    __v: {
      type: Number,
      select: false,
    },
  },
  {
    id: false,
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const CommentModel: ICommentModel = mongoose.model<IComment, ICommentModel>(
  "Comment",
  commentSchema
);

export default CommentModel;
