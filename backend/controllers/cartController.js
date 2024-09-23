import userModel from "../models/userSchema.js";

// add to user cart
const addToCart = async (req, res) => {
  try {
    const userData = await userModel.findOne({ _id: req.body.userId });
    let cartData = await userData.cartData;
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.status(200).json({
      success: true,
      messaga: "Added To Cart",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// remove food from user cart
const removeFromCart = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.userId);
    let cartData = await userData.cartData;
    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.status(200).json({
      success: true,
      message: "Removed from cart",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get user cart
const getCart = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.userId);
    let cartData = await userData.cartData;
    res.status(200).json({ success: true, cartData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { addToCart, removeFromCart, getCart };
