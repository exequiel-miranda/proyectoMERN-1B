import jsonwebtoken from "jsonwebtoken"; //Token
import bcryptjs from "bcryptjs"; //Encriptar

import clientsModel from "../models/customers.js";
import employeeModel from "../models/employee.js";

import { sendEmail, HTMLRecoveryEmail } from "../utils/mailPasswordRecovery.js";
import { config } from "../config.js";

// 1- Crear un array de funciones
const passwordRecoveryController = {};

passwordRecoveryController.requestCode = async (req, res) => {
  const { email } = req.body;

  try {
    let userFound;
    let userType;

    userFound = await clientsModel.findOne({ email });
    if (userFound) {
      userType = "client";
    } else {
      userFound = await employeeModel.findOne({ email });
      userType = "employee";
    }

    if (!userFound) {
      return res.json({ message: "User not found" });
    }

    // Generar un código de 5 digitos
    const code = Math.floor(10000 + Math.random() * 60000).toString();

    // generar un token
    const token = jsonwebtoken.sign(
      //1-¿qué voy a guardar?
      { email, code, userType, verfied: false },
      //2- secret key
      config.JWT.secret,
      //3- ¿Cúando expira?
      { expiresIn: "25m" }
    );

    res.cookie("tokenRecoveryCode", token, { maxAge: 25 * 60 * 1000 });

    // Enviamos el correo
    await sendEmail(
      email,
      "Password recovery Code",
      `your verification code is ${code}`,
      HTMLRecoveryEmail(code)
    );

    res.json({ message: "Verification code send" });
  } catch (error) {
    console.log("error" + error);
  }
};
