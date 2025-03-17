/*
    Campos:
        comment
        rating
        idClient
*/

import { Schema, model } from "mongoose";

const reviewsSchema = new Schema(
  {
    comment: {
      type: String,
      require: true,
    },
    rating: {
      type: Number,
      require: true,
      min: 0,
      max: 5,
    },
    idClient: {
      type: Schema.Types.ObjectId,
      ref: "customers",
      require: true,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Reviews", reviewsSchema);
