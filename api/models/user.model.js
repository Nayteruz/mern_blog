import mongoose from "mongoose";

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector.png",
  }
}, { timestamps: true }
);

const User = mongoose.model("User", schema);

export default User