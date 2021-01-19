/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  userid: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  urls: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Url",
    },
  ],
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.password;
    delete returnedObject.__v;
    delete returnedObject.type;
  },
});

const User = mongoose.model("User", userSchema);

export default User;
