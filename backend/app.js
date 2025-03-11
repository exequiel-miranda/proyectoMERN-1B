// Importo todo lo de la libreria express
import express from "express";
import productsRoutes from "./src/routes/products.js";

// Creo una constante que es igual
// a la libreria que importé y la ejecuta
const app = express();

// Uso un middleware para que acepte datos Json
app.use(express.json());

// Definir la ruta
app.use("/api/products", productsRoutes);

// Exporto la constante para poder usar express en otros lados
export default app;
