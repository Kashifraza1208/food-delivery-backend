import express from "express";
import {
  addFood,
  getAllFoodItem,
  removeFood,
} from "../controllers/foodController.js";

import multer from "multer";

const foodRouter = express.Router();

//Image storage engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
});

foodRouter.route("/add").post(upload.single("image"), addFood);
foodRouter.route("/lists").get(getAllFoodItem);
foodRouter.route("/remove").post(removeFood);

export default foodRouter;
