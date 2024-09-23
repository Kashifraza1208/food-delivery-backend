import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
} from "../controllers/cartController.js";
import { isAuthenticatedUser } from "../middleware/auth.js";

const cartRouter = express.Router();

cartRouter.route("/get").post(isAuthenticatedUser, getCart);
cartRouter.route("/add").post(isAuthenticatedUser, addToCart);
cartRouter.route("/remove").post(isAuthenticatedUser, removeFromCart);

export default cartRouter;
