/*
Como vamos a validar si es cliente o empleado,
entonces importo ambos modelos
 */
import CustomersModel from "../models/customers.js";
import EmployeesModel from "../models/employee.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

const loginController = {};

//Declarar dos contantes
//Una que guarde el maximo de intentos posibles
// Y otra que guarde el tiempo de bloqueo

const maxAttempts = 3;
const lockTime = 15 * 60 * 1000; //15 minutos

loginController.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validamos los 3 posibles niveles
    // 1. Admin, 2. Empleado, 3. Cliente

    let userFound; //Variable que dice si encontramos un usuario
    let userType; // Variable que dice que tipo de usuario es

    // 1. Admin
    // Varifiquemos si quien está ingresando es Admin
    if (
      email === config.emailAdmin.email &&
      password === config.emailAdmin.password
    ) {
      userType = "Admin";
      userFound = { _id: "Admin" };
    } else {
      // 2. Empleado
      userFound = await EmployeesModel.findOne({ email });
      userType = "Employee";

      // 3. Cliente
      if (!userFound) {
        userFound = await CustomersModel.findOne({ email });
        userType = "Customer";
      }
    }

    // Si no encontramos un usuario en ningun lado
    if (!userFound) {
      return res.json({ message: "User not found" });
    }

    //Primero, determino si el usuario está bloqueado o no
    if (userType !== "Admin") {
      if (userFound.lockTime > Date.now()) {
        const minutosRestantes = Math.ceil(
          userFound.lockTime - Date.now() / 60000
        );
        return res.status(403).json({
          message: "Cuenta bloqueada, intenta de nuevo en" + minutosRestantes,
        });
      }
    }

    // Si no es administrador, validamos la contraseña
    if (userType !== "Admin") {
      const isMatch = await bcryptjs.compare(password, userFound.password);
      if (!isMatch) {
        //Si la contraseña es incorrecta
        //incrementar el numero de intentos fallidos
        userFound.loginAttempts = userFound.loginAttempts + 1;

        if (userFound.loginAttempts > maxAttempts) {
          userFound.lockTime = Date.now() + lockTime;
          await userFound.save();
          return res.status(403).json({ message: "Usuario bloqueado" });
        }

        await userFound.save();

        return res.json({ message: "Invalid password" });
      }

      userFound.loginAttempts = 0;
      userFound.lockTime = null;
      await userFound.save();
    }

    // Generar token
    jsonwebtoken.sign(
      //1- Que voy a guardar
      { id: userFound._id, userType },
      //2- Clave secreta
      config.JWT.secret,
      //3- Cuando expira
      { expiresIn: config.JWT.expiresIn }
    );

    res.cookie("authToken", token, {
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
      sameSite: "lax",
    });
    res.json({ message: "login successful" });
  } catch (error) {
    console.log(error);
  }
};
export default loginController;
