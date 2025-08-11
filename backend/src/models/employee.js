/*
    Campos:
        nombre
        descripcion
        precio
        stock
*/

import { Schema, model } from "mongoose";

const employeeSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },

    lastName: {
      type: String,
    },

    birthday: {
      type: Date,
      require: true,
    },

    email: {
      type: String,
    },

    address: {
      type: String,
    },

    password: {
      type: String,
      require: true,
    },
    hireDate: {
      type: String,
    },

    telephone: {
      type: String,
      require: true,
    },

    dui: {
      type: String,
      require: true,
    },
    isVerified: {
      type: Boolean,
    },
    issnumber: {
      type: String,
      require: true,
    },
    
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockTime: {
      type: Date,
      default: null
    }

  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("employee", employeeSchema);
