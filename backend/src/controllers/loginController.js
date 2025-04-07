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

    // Si no es administrador, validamos la contraseña
    if (userType !== "Admin") {
      const isMatch = await bcryptjs.compare(password, userFound.password);
      if (!isMatch) {
        return res.json({ message: "Invalid password" });
      }
    }

    // Generar token
    jsonwebtoken.sign(
      //1- Que voy a guardar
      { id: userFound._id, userType },
      //2- Clave secreta
      config.JWT.secret,
      //3- Cuando expira
      { expiresIn: config.JWT.expiresIn },
      //4- Función flecha
      (error, token) => {
        if (error) console.log(error);

        res.cookie("authToken", token);
        res.json({ message: "login successful" });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
export default loginController;
