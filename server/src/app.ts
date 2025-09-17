import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import moment from "moment-timezone";

dotenv.config();


const app = express();



app.use(
  cors({
    origin: [process.env.CLIENT_URL || ""],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "UPDATE", "PUT"],
  })
);

app.use(cookieParser());

app.use(express.json({ limit: "1mb" }));
morgan.token("date", () => {
  return moment().tz("Asia/Kolkata").format("DD-MM-YYYY hh:mm:ss A");
});

app.use(
  morgan("[:date] :method :url :status :res[content-length] - :response-time ms")
);




export default app;
