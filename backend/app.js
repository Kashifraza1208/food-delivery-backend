import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();

if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "backend/config/config.env" });
}

//middleware

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  console.log("hello from server");
  res.send({
    message: "Hello from server",
  });
});

//api endpoint

app.use("/api/v1/food", foodRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);
app.use("/images", express.static("uploads"));

export default app;
