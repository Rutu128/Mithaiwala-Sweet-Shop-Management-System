import app from "./app";
import { connectDB } from "./db";
import "./services/cron.service"; // Import to initialize cron job

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await connectDB().then(() => {
    console.log(`[SERVER] Server is running on port ${PORT}`);
    console.log(`[SERVER] Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`[SERVER] Cron job will call backend URL every 10 minutes`);
  }).catch((error) => {
    console.error(`[SERVER] Database connection failed:`, error);
  });
});