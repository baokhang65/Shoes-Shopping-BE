import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/login", loginRoutes);

app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
});