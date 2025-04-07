import jsonwebtoken from "jsonwebtoken"; // Token
import bcryptjs from "bcryptjs"; // Encriptar
import nodemailer from "nodemailer"; // Enviar Correo
import crypto from "crypto"; // Codigo aleatorio

import clientsModel from "../models/customers.js";
import { config } from "../config.js";

// Creamos un array de funciones
const registerClientsController = {};

registerClientsController.register = async (req, res) => {
  //1- Solicitar las cosas que vamos a guardar
  const {
    name,
    lastName,
    birthday,
    email,
    password,
    telephone,
    dui,
    isVerified,
  } = req.body;

  try {
    // Verificamos si el cliente ya existe
    const existsClient = await clientsModel.findOne({ email });
    if (existsClient) {
      return res.json({ message: "Client already exists" });
    }

    // Encriptar la contraseña
    const passwordHash = await bcryptjs.hash(password, 10);

    // Guardo al cliente en la base de datos
    const newClient = new clientsModel({
      name,
      lastName,
      birthday,
      email,
      password: passwordHash,
      telephone,
      dui: dui || null,
      isVerified: isVerified || false,
    });

    await newClient.save();

    // Generamos un código aleatorio
    const verificationCode = crypto.randomBytes(3).toString("hex");

    // Crear el Token
    const tokenCode = jsonwebtoken.sign(
      //1- ¿Que vamos a guardar?
      { email, verificationCode },
      //2- Palabra secreta
      config.JWT.secret,
      //3- Cuando expira
      { expiresIn: "2h" }
    );

    res.cookie("VerificationToken", tokenCode, { maxAge: 2 * 60 * 60 * 1000 });

    // Enviar el correo electronico
    //1- Transporter => Quien lo envia
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.email_user,
        pass: config.email.email_pass,
      },
    });

    //2- MailOptions => Quien lo recibe
    const mailOptions = {
      //¿Quien lo envia?
      from: config.email.email_user,
      //¿quien lo recibe?
      to: email,
      // Asunto
      subject: "Verificación de correo",
      // Cuerpo del correo electrónico
      text: `Para verificar tu correo, utiliza el 
        siguiente código ${verificationCode}\n El codigo 
        vence en dos horas`,
    };

    // 3- Enviar correo
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return res.json({ message: "Error" });

      console.log("Correo enviado" + info.response);
    });

    res.json({
      message: "Client registered. Please verify your email whit the code sent",
    });
  } catch (error) {
    res.json({ message: "Error" + error });
  }
};

// Verificar el codigo
registerClientsController.verifyCodeEmail = async (req, res) => {
  const { verificationCode } = req.body;

  //Obtengo el token que contiene el codigo de verificacion
  const token = req.cookies.VerificationToken;

  try {
    // Verficar y decodificar el token
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    const { email, verificationCode: storedCode } = decoded;

    //Comparar el código que enviamos al correo
    // con el que el usuario escribe
    if (verificationCode !== storedCode) {
      return res.json({ message: "Invalid code" });
    }

    // Cambiamos el estado de "isVerified" a true
    const client = await clientsModel.findOne({ email });
    client.isVerified = true;
    await client.save();

    res.json({ message: "Email verified successfull" });

    //Quito la cookie con el token
    res.clearCookie("VerificationToken");
  } catch (error) {
    res.json({ message: "error" });
  }
};

export default registerClientsController;
