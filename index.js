const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user.js");
const productRoutes = require("./routes/product.js");
const cartRoutes = require("./routes/cart.js");
const orderRoutes = require("./routes/order.js");
const port = 4000;
require("dotenv").config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const corsOptions = {
  origin: ["https://capstone3-three-navy.vercel.app", "https://capstone3-git-master-jeswels-projects.vercel.app", "https://capstone3-kupk6w1hj-jeswels-projects.vercel.app"],
  credentials: true,
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))
mongoose.connect(process.env.MONGODB_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
app.use("/b1/users", userRoutes);
app.use("/b1/products", productRoutes);
app.use("/b1/cart", cartRoutes);
app.use("/b1/orders", orderRoutes);

app.listen(port, () =>
  console.log(`API is now available on port ${process.env.PORT || port}`)
)

module.exports = { app, mongoose }
