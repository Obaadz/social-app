import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { IUser } from "./userModel.js";
import { IPost } from "./postModel.js";
import moment from "moment";

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
    __v: {
      type: Number,
      select: false,
    },
  },
  {
    id: false,
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.createdAt;
      },
    },
  }
);

commentSchema.virtual("createdFrom").get(function (this: IPost) {
  if (!this.createdAt) return;

  const currentTime = moment();
  const pastTime = moment(this.createdAt);

  return pastTime.from(currentTime);
});

const CommentModel: ICommentModel = mongoose.model<IComment, ICommentModel>(
  "Comment",
  commentSchema
);

export default CommentModel;
