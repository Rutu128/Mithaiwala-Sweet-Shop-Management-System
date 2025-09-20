import cron from "node-cron";
import axios from "axios";

// Function to call API
async function callApi() {
  try {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
    const healthEndpoint = `${backendUrl}/api/health`;
    
    console.log(`[CRON] Calling API: ${healthEndpoint}`);
    const response = await axios.get(healthEndpoint, {
      timeout: 10000, // 10 seconds timeout
      headers: {
        'User-Agent': 'Mithaiwala-CronJob/1.0',
        'X-Cron-Job': 'true'
      }
    });
    
    console.log(`[CRON] API Response Status: ${response.status}`);
    console.log(`[CRON] API Response:`, response.data);
  } catch (error: any) {
    console.error(`[CRON] API call failed:`, error.message);
    if (error.response) {
      console.error(`[CRON] Response status: ${error.response.status}`);
    }
  }
}

// Schedule cron job: every 10 minutes
const cronJob = cron.schedule("*/10 * * * *", () => {
  console.log(`[CRON] Running cron job at: ${new Date().toISOString()}`);
  callApi();
}, {
  timezone: "Asia/Kolkata"
});
console.log(`[CRON] Cron job scheduled to run every 10 minutes`);

export default cronJob;
