import * as throng from "throng";
import { subscriptionFormEntries } from "./graphql/subscriptions";
import widgets from "./form_mapping";

throng({
  workers: 1,
  start: async (id: number) => {
    console.log(`Started worker ${id}`);

    try {
      console.log("Fetching solidarity users...");
      console.log(
        "Call subscriptions to form_entries...",
        widgets.map((w: any) => w.id)
      );
      await subscriptionFormEntries(widgets);
    } catch (err) {
      console.error("throng err: ".red, err);
    }

    process.on("SIGTERM", function () {
      console.log(`Worker ${id} exiting`);
      console.log("Cleanup here");
      process.exit();
    });
  },
});
