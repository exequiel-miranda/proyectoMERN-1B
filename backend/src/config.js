import dotenv from "dotenv";

// Ejecutamos la libreria
// para acceder al .env
dotenv.config();

export const config = {
  db: {
    URI: process.env.DB_URI,
  },
  server: {
    port: process.env.PORT,
  },
};
