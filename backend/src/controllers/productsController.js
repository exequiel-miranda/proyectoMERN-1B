// array de funciones
// del CRUD
const productsController = {};
import productsModel from "../models/Products.js";

// S E L E C T
productsController.getProducts = async (req, res) => {
  const products = await productsModel.find();
  res.json(products);
};

// I N S E R T
productsController.insertProducts = async (req, res) => {
  const { name, description, price, stock } = req.body;
  const newProduct = new productsModel({ name, description, price, stock });
  await newProduct.save();
  res.json({ message: "product saved" });
};

// D E L E T E
productsController.deleteProduct = async (req, res) => {
  await productsModel.findByIdAndDelete(req.params.id);
  res.json({ message: "product deleted" });
};

// U P D A T E
productsController.updateProduct = async (req, res) => {
  const { name, description, price, stock } = req.body;
  const updatedProduct = await productsModel.findByIdAndUpdate(
    req.params.id,
    { name, description, price, stock },
    { new: true }
  );
  res.json({ message: "product updated" });
};

export default productsController;
