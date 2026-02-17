import cron from "node-cron";
import { expireReserves } from "./app/modules/order/order.cron";
 
 

export const startCronJobs = () => {
  cron.schedule("* * * * *", async () => {
    await expireReserves();
  });
};
