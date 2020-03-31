import * as throng from "throng";
import { logger } from "./logger";
import { subscriptionRedesIndividuals } from "./individuals";

throng({
  workers: 1,
  start: async (id: number) => {
    logger.log("info", `Started worker ${id}`);

    try {
      logger.log("info", "Call subscriptions to redes-individuals...");
      await subscriptionRedesIndividuals();
    } catch (err) {
      logger.error("info", "throng err: ", err);
    }

    process.on("SIGTERM", () => {
      logger.log("info", `Worker ${id} exiting`);
      logger.log("info", "Cleanup here");
      process.exit();
    });
  }
});
