import foodModal from "../models/foodSchema.js";

import fs from "fs";

// add food items

export const addFood = async (req, res) => {
  try {
    let image_filename = `${req.file.filename}`;

    const { name, price, description, category } = req.body;

    const food = new foodModal({
      name,
      price,
      description,
      image: image_filename,
      category,
    });

    await food.save();
    res
      .status(201)
      .json({ succcess: true, message: "Food item added successfully" });
  } catch (error) {
    res.status(500).json({
      succcess: false,
      message: "Failed to add food item",
    });
  }
};

export const getAllFoodItem = async (req, res) => {
  try {
    const foods = await foodModal.find({});
    res.status(200).json({
      succcess: true,
      foods,
    });
  } catch (error) {
    res.status(500).json({
      succcess: false,
      message: "Failed to fetched food item",
    });
  }
};

export const removeFood = async (req, res) => {
  try {
    const food = await foodModal.findById(req.body.id);

    if (!food) {
      return res
        .status(404)
        .json({ succcess: false, message: "food not exist" });
    }

    fs.unlink(`uploads/${food.image}`, () => {});

    await foodModal.findByIdAndDelete(req.body.id);
    res.status(200).json({
      succcess: true,
      message: "Food item removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      succcess: false,
      message: "Failed to deleted food item",
    });
  }
};
