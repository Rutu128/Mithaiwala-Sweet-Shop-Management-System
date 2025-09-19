import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import moment from "moment-timezone";
import indexRoutes from "./routes";
dotenv.config();


const app = express();



app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "UPDATE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
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


app.use("/api", indexRoutes);





export default app;
