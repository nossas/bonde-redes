import throng from "throng";
import { subscriptionFormEntries } from "./graphql/subscriptions";
import widgets from "./form_entries_mapping";
import dbg from "./dbg";

const log = dbg.extend("main");

throng({
  workers: 1,
  start: async (id: number) => {
    log(`Started worker ${id}`);

    try {
      log("Fetching solidarity users...");
      log(
        "Call subscriptions to form_entries...",
        widgets.map((w: any) => w.id)
      );
      await subscriptionFormEntries(widgets);
    } catch (err) {
      log("throng err: ".red, err);
    }

    process.on("SIGTERM", function() {
      log(`Worker ${id} exiting`);
      log("Cleanup here");
      process.exit();
    });
  }
});
