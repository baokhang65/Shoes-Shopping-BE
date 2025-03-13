import fs from "fs";
import path from "path";

const __dirname = path.resolve();
const dataFile = path.join(__dirname, "src", "models", "products.json");

// API: Lấy tất cả sản phẩm theo type & filter theo thứ tự
export const getProductsByType = (req, res) => {
    fs.readFile(dataFile, "utf8", (err, data) => {
        if (err) return res.status(500).json({ message: "Lỗi server" });

        let products = JSON.parse(data);
        const { type, sortBy, order } = req.query;

        // 🔹 Lọc theo thương hiệu (type)
        if (type) {
            products = products.filter((p) => p.brand.toLowerCase() === type.toLowerCase());
        }

        // 🔹 Sắp xếp sản phẩm theo giá hoặc tên
        if (sortBy) {
            products.sort((a, b) => {
                if (sortBy === "price") {
                    return order === "desc" ? b.price - a.price : a.price - b.price;
                }
                if (sortBy === "name") {
                    return order === "desc" ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
                }
                return 0;
            });
        }

        res.json(products);
    });
};

// API: Lấy Best Seller theo ID cụ thể + Collection Today (Random)
export const getHomePageProducts = (req, res) => {
    fs.readFile(dataFile, "utf8", (err, data) => {
        if (err) return res.status(500).json({ message: "Lỗi server" });

        let products = JSON.parse(data);

        // 🔹 Best Seller - Lấy sản phẩm theo ID cụ thể
        const bestSellerIds = [1, 3, 5]; // ID của sản phẩm Best Seller
        const bestSellers = products.filter((p) => bestSellerIds.includes(p.id));

        // 🔹 Collection Today - Random sản phẩm
        const numRandomProducts = 4; // Số sản phẩm random
        const collectionToday = products
            .filter((p) => !bestSellerIds.includes(p.id)) // Loại bỏ Best Seller
            .sort(() => 0.5 - Math.random()) // Xáo trộn danh sách
            .slice(0, numRandomProducts); // Lấy số lượng sản phẩm cần thiết

        res.json({ bestSellers, collectionToday });
    });
};
