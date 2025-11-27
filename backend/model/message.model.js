import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
}, {
    timestamps: true,
});

export const Message = mongoose.model("Message", messageSchema);
