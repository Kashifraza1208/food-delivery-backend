import dotenv from "dotenv";
import app from "./app.js";
import { ConnectDB } from "./config/database.js";

if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "backend/config/config.env" });
}
const port = process.env.PORT || 8000;
ConnectDB()

app.listen(port, (req, res) => {
  console.log(`Server is running on port ${port}`);
});
