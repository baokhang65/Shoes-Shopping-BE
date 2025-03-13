import fs from "fs";
import path from "path";

const __dirname = path.resolve();
const dataFile = path.join(__dirname, "src", "models", "products.json");

export const getAllProducts = (req, res) => {
    fs.readFile(dataFile, "utf8", (err, data) => {
        if (err) return res.status(500).json({ message: "Server Error" });

        let products = JSON.parse(data);
        const { name, brand, minPrice, maxPrice, size, random, count } = req.query;

        // Price Filter
        if (minPrice) {
            products = products.filter((p) => p.price >= parseFloat(minPrice));
        }
        if (maxPrice) {
            products = products.filter((p) => p.price <= parseFloat(maxPrice));
        }

        // Nếu query random=true, trộn danh sách và lấy số lượng sản phẩm ngẫu nhiên
        if (random === "true") {
            const numProducts = count ? parseInt(count) : 3; // Mặc định lấy 3 sản phẩm
            products = products.sort(() => 0.5 - Math.random()).slice(0, numProducts);
        }

        res.json(products);
    });
};
