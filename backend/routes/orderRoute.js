import express from "express";
import { isAuthenticatedUser } from "../middleware/auth.js";
import {
  getAllOrders,
  placeOrder,
  updateOrder,
  userOrders,
  verifyOrder,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.route("/place").post(isAuthenticatedUser, placeOrder);
orderRouter.route("/verify").post(verifyOrder);
orderRouter.route("/userOrder").post(isAuthenticatedUser, userOrders);
orderRouter.route("/orders").get(getAllOrders);
orderRouter.route("/update").put(updateOrder);

export default orderRouter;
