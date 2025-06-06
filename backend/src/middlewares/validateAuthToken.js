import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

export const validateAuthToken = (allowedUserTypes = []) => {
  return (req, res, next) => {
    try {
      //1- Extraer el token de las cookies
      const { authToken } = req.cookies;
      //1- Validar si existen las cookies
      if (!authToken) {
        return res.json({
          message: "No auth Cookie found, authorization required",
        });
      }

      //2- Extraer el token de las cookies
      //   const {authToken} = req.cookies;

      //3- Extraemos toda la información que tiene el token
      const decoded = jsonwebtoken.verify(authToken, config.JWT.secret);

      //Almacenar los datos del usuario en un request
      req.user = decoded;

      //Verificar el rol
      if (!allowedUserTypes.includes(decoded.userType)) {
        return res.json({ message: "Access denied" });
      }

      //Si el si está, podemos continuar
      next();
    } catch (error) {
      console.log("error" + error);
    }
  };
};
