import cron from "node-cron";

// Auto cleanup disabled to prevent deleting students who are registering or paying.
// Student accounts are preserved permanently unless explicitly deleted by an admin.
cron.schedule("0 0 * * *", async () => {
  // Safe daily heartbeat
});
