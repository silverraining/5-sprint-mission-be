import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import prisma from "./prisma.service.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/", router);
prisma
  .$connect()
  .then(() => {
    console.log("Connected to PostgreSQL database");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Started :${PORT}`));
