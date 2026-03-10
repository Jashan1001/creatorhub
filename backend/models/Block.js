import mongoose from "mongoose";

const blockSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  type: {
    type: String,
    enum: ["link", "text", "image", "video"],
    required: true
  },

  content: {
    type: Object,
    default: {}
  },

  position: {
    type: Number,
    default: 0
  },

  visible: {
    type: Boolean,
    default: true
  }

},
{ timestamps: true }
);

export default mongoose.model("Block", blockSchema);