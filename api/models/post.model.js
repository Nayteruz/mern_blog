import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: false,
  },
  userId: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector.png",
  },
  category: {
    type: String,
    default: 'uncategorized',
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  }
}, { timestamps: true }
);

const Post = mongoose.model("Post", schema);

export default Post;