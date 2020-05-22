import gql from "graphql-tag";
import { client as GraphQLAPI } from "..";
import { Widget } from "../../types";
import { handleNext } from "../../components";
import dbg from "../../dbg";

const log = dbg.extend("subscriptionFormEntries");

const FORM_ENTRIES_SUBSCRIPTION = gql`
  subscription pipeline_form_entries($widgets: [Int!]) {
    form_entries(
      where: {
        widget_id: { _in: $widgets }
        rede_syncronized: { _eq: false }
        id: { _eq: 2000302 }
      }
      order_by: { id: asc }
    ) {
      id
      fields
      cached_community_id
      activist_id
      widget_id
      created_at
    }
  }
`;

const error = (err: any) => {
  log("Receiving error on subscription GraphQL API: ", err);
};

export default async (widgets: Widget[]): Promise<any> => {
  try {
    const observable = GraphQLAPI.subscribe({
      query: FORM_ENTRIES_SUBSCRIPTION,
      variables: { widgets: widgets.map((w: any) => w.id) },
      fetchPolicy: "network-only",
    }).subscribe({ next: handleNext(widgets), error });

    return observable;
  } catch (err) {
    log("failed on subscription: ".red, err);
    return undefined;
  }
};
