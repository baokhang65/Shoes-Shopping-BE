import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import productRoutes from "./routes/productsRoute.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("public"));
app.use(morgan("dev"));


//API routes
app.use("/api/products", productRoutes);

// Middleware xử lý lỗi chung
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
});

//404 error
app.use((req, res) => {
    res.status(404).json({ message: "API Not Found" });
});

export default app;