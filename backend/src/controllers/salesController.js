import salesModel from "../models/Sales.js";

//Array de funciones vacío
const salesController = {};

//Select
salesController.getAllSales = async (req, res) => {
  try {
    const sales = await salesModel.find();
    res.status(200).json(sales);
  } catch (error) {
    console.log("Error" + error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//Insert
salesController.insertSales = async (req, res) => {
  try {
    //Pedir los datos
    const { product, category, customer, total } = req.body;

    if (total < 0) {
      res.status(400).json({ message: "ingrese un valor valido" });
    }

    //Guardamos en la base de datos
    const newSales = new salesModel({ product, category, customer, total });
    await newSales.save();

    //Mensaje de confirmación
    res.status(200).json({ message: "Sale saved" });
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Editar
salesController.updateSales = async (req, res) => {
  try {
    //Pedir los datos
    const { product, category, customer, total } = req.body;

    if (total < 0) {
      res.status(400).json({ message: "ingrese un valor valido" });
    }

    await salesModel.findByIdAndUpdate(
      req.params.id,
      { product, category, customer, total },
      { new: true }
    );

    //Mensaje de confirmación
    res.status(200).json({ message: "Sales updated" });
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Eliminar
salesController.deleteSales = async (req, res) => {
  try {
    await salesModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Sale deleted" });
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ======================
// ventas por categoria
// =======================

salesController.getSalesByCategory = async (req, res) => {
  try {
    const resultado = await salesModel.aggregate([
      {
        $group: {
          _id: "$category",
          totalVentas: { $sum: "$total" },
        },
      },
      //ordenar los resultados
      {
        $sort: { totalVentas: -1 },
      },
    ]);

    res.status(200).json(resultado);
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ========================
// Productos más vendidos
// ========================

salesController.getTopSellingProducts = async (req, res) => {
  try {
    const resultado = await salesModel.aggregate([
      {
        $group: {
          _id: "$products",
          totalSales: { $sum: 1 },
        },
      },
      //Ordenar los resultados
      {
        $sort: { totalSales: -1 },
      },
      //Limitar la cantidad de datos a mostrar
      {
        $limit: 5,
      },
    ]);

    res.status(200).json(resultado);
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ====================
// Ganancias totales
// ====================

salesController.totalEarnings = async (req, res) => {
  try {
    const resultado = await salesModel.aggregate([
      {
        $group: {
          _id: null,
          gananciasTotales: { $sum: "$total" },
        },
      },
    ]);

    res.status(200).json(resultado);
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ====================
// Cliente frecuente
// ====================

salesController.getFrequentCustomers = async (req, res) => {
  try {
    const resultado = await salesModel.aggregate([
      {
        $group: {
          _id: "$customer",
          comprasRealizadas: { $sum: 1 },
        },
      },
      //ordenar
      {
        $sort: { comprasRealizadas: -1 },
      },
      //limitar
      {
        $limit: 3,
      },
    ]);

    res.status(200).json(resultado);
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default salesController;
