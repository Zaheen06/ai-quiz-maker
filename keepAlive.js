import cron from "node-cron";
import pkg from "pg";
const { Client } = pkg;

// 🔐 Replace with your Neon connection string
const client = new Client({
  connectionString: process.env.DATABASE_URL || "your-neon-db-url-here",
  ssl: { rejectUnauthorized: false },
});

// 🕒 Schedule: every 3 days at midnight
cron.schedule("0 0 */3 * *", async () => {
  try {
    await client.connect();
    await client.query("SELECT 1;");
    console.log("✅ NeonDB keep-alive query executed successfully");
  } catch (error) {
    console.error("❌ Keep-alive query failed:", error);
  } finally {
    await client.end();
  }
});
