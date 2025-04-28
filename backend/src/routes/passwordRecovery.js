import express from "express";

const router = express.Router();

router.route("/requestCode").post();
router.route("/verifyCode").post();
router.route("/newPassword").post();

export default router;
