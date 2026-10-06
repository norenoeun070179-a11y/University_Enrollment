import cron from "node-cron";

// Auto payment cleanup disabled so pending/paying payments are never automatically deleted or expired.
// Payments are kept permanently for verification unless manually managed by an admin.
cron.schedule("0 0 * * *", async () => {
  // Safe daily heartbeat
});