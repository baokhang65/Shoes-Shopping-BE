import express from "express";
import { getProductsByType, getHomePageProducts } from "../controllers/productsController.js";

const router = express.Router();

router.get("/", getProductsByType); // API lấy sản phẩm theo type + filter
router.get("/homepage", getHomePageProducts); // API lấy sản phẩm Best Seller + Collection Today

export default router;