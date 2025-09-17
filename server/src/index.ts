import app from "./app";
import { connectDB } from "./db";

const PORT = process.env.PORT || 3000;



app.listen(PORT, async () => {
  await connectDB().then(() => {
    console.log(`Server is running on port ${PORT}`);
  }).catch((error) => {
    console.log(error);
  });
});