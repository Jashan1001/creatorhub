import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true
  },

  username: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },
  role: {
  type: String,
  enum: ["creator", "admin"],
  default: "creator"
},

  avatar: {
    type: String,
    default: ""
  },

  bio: {
    type: String,
    default: ""
  },

  plan: {
    type: String,
    default: "free"
  }

},
{ timestamps: true }
);

export default mongoose.model("User", userSchema);