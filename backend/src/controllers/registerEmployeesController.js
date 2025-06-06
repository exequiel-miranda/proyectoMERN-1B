// Importamos el modelo de la base de datos
import Employee from "../models/employee.js";
import bcryptjs from "bcryptjs"; // Lib. para encriptar
import jsonwebtoken from "jsonwebtoken"; // Lib. para token
import { config } from "../config.js";

// creamos un array de funciones
const registerEmployeesController = {};

registerEmployeesController.register = async (req, res) => {
  // pedimos todos los datos
  const {
    name,
    lastName,
    birthday,
    email,
    address,
    password,
    hireDate,
    telephone,
    dui,
    isVerified,
    issnumber,
  } = req.body;

  try {
    // Verificamos si el empleado ya existe
    const existEmployee = await Employee.findOne({ email });
    if (existEmployee) {
      return res.json({ message: "Employee already exists" });
    }

    // Hashear o encriptar la contraseña
    const passwordHash = await bcryptjs.hash(password, 10);

    // Guardamos el empleado en la base de datos
    const newEmployee = new Employee({
      name,
      lastName,
      birthday,
      email,
      address,
      password: passwordHash,
      hireDate,
      telephone,
      dui,
      isVerified,
      issnumber,
    });

    await newEmployee.save();

    const userType = "Employee";
    // Generar un token que valide que ya estoy registrado
    // y puedo acceder a todas las paginas
    jsonwebtoken.sign(
      // 1 - que voy a guardar
      { id: newEmployee._id, userType },
      // 2- Clave secreta
      config.JWT.secret,
      // 3- cuando expira
      { expiresIn: config.JWT.expiresIn },
      // 4- funcion flecha
      (error, token) => {
        if (error) console.log(error);
        res.cookie("authToken", token);
        res.json({ message: "Empleado registrado" });
      }
    );
  } catch (error) {
    console.log(error);
    res.json({ message: "Error al registrar empleado" });
  }
};

export default registerEmployeesController;
