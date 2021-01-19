/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import mongoose from "mongoose";

const urlSchema = mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
  },
  associatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

urlSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.__v;
  },
});

const Url = mongoose.model("Url", urlSchema);

export default Url;
