import express from "express";
import salesController from "../controllers/salesController.js";

const router = express.Router();

router
  .route("/")
  .get(salesController.getAllSales)
  .post(salesController.insertSales);
router
  .route("/:id")
  .delete(salesController.deleteSales)
  .put(salesController.updateSales);


router.route("/sales-by-category")
.get(salesController.getSalesByCategory);

router.route("/top-selling-products")
  .get(salesController.getTopSellingProducts);

router.route("/total-earnings")
.get(salesController.totalEarnings);

router.route("/get-frequent-customers")
.get(salesController.getFrequentCustomers)


export default router