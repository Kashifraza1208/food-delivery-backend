import orderModel from "../models/orderSchema.js";
import userModel from "../models/userSchema.js";
import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51Ndd1bSG403aKdO4r9NmEXMQhGZmxs01w048SGMKkNUrpHumignFvq1ZsqnxXFCu9ie3Kde20cTtr1XeZOFTwFMl00xICtusVc"
);

export const placeOrder = async (req, res) => {
  try {
    const frontend_url = "http://localhost:3000";
    const newOrder = await orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100 * 83,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charge",
        },
        unit_amount: 2 * 100 * 83,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.status(201).json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    console.error(error);
    res.status(201).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOrder = async (req, res) => {
  try {
    const { orderId, success } = req.body;
    if (success == "true") {
      const order = await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
      });
      res.status(200).json({
        success: true,
        message: "Paid",
      });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.status(300).json({
        success: false,
        message: "Not Paid",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while payment",
    });
  }
};

export const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: true,
      message: "order fetched failed",
    });
  }
};

//get all orders

export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
    });
  }
};

export const updateOrder = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.status(200).json({
      success: true,
      message: "Order updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update",
    });
  }
};
