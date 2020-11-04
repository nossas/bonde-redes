import { gql } from "@apollo/client";
import { client as GraphQLAPI } from "../../graphql";
import { updateFormEntries, insertRedeIndividuals } from "./";

const FORM_ENTRIES_SUBSCRIPTION = gql`
  subscription pipeline_form_entries($widgets: [Int!]) {
    form_entries(
      where: { widget_id: { _in: $widgets }, rede_syncronized: { _eq: false } }
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
interface Widget {
  id: number;
  group_id: number;
  metadata: object;
}

interface MetaField {
  uid: string;
  name: string;
}

let cache: Array<any> = [];

const handleNext = (widgets: Widget[]) => async (response: any) => {
  console.log(`${new Date()}: \nReceiving data on subscription GraphQL API...`);
  const {
    data: { form_entries: entries }
  } = response;

  entries.forEach((formEntry: any) => {
    if (cache.filter((c: any) => c.id !== formEntry.id)) {
      cache.push(formEntry);
    }
  });

  const syncronizedForms: Array<any> = [];
  const individuals: Array<any> = [];
  if (cache.length > 0) {
    cache.forEach((formEntry: any) => {
      const fields = JSON.parse(formEntry.fields);
      const widget = widgets.filter(
        (w: any) => w.id === formEntry.widget_id
      )[0];
      if (widget) {
        const instance = {};
        widget.metadata["form_mapping"].forEach((field: MetaField) => {
          const acessors = field.name.split(".");
          if (acessors.length === 1) {
            const fieldValue = (
              fields.filter((f: any) => f.uid === field.uid)[0] || {}
            ).value;
            instance[acessors[0]] = acessors[0] === 'zipcode' ? fieldValue.substr(0, 100) : fieldValue
          } else {
            // extra fields
            const rootField = acessors[0];
            const childField = acessors[1];
            const value = {
              [childField]: (
                fields.filter((f: any) => f.uid === field.uid)[0] || {}
              ).value
            };

            instance[rootField] = Object.assign({}, instance[rootField], value);
          }
        });

        // fields of integration
        instance["rede_group_id"] = widget.group_id;
        instance["form_entry_id"] = formEntry.id;

        // store instances
        individuals.push(instance);
        syncronizedForms.push(formEntry.id);
      }
    });

    // console.log('individuals', individuals)
    // Batch insert individuals
    console.log("Inserting the new individuals on GraphQL API...");
    await insertRedeIndividuals(individuals);
    // Batch update syncronized forms
    console.log("Updating form_entries syncronized on GraphQL API...");
    await updateFormEntries(syncronizedForms);

    cache = [];
    console.log("Integration is done.");
  } else {
    console.log("No items for integration.");
  }
};

const error = (err: any) => {
  console.error("Receiving error on subscription GraphQL API: ", err);
};

export default async (widgets: Widget[]): Promise<any> => {
  try {
    const observable = GraphQLAPI.subscribe({
      query: FORM_ENTRIES_SUBSCRIPTION,
      variables: { widgets: widgets.map((w: any) => w.id) },
      fetchPolicy: "network-only"
    }).subscribe({ next: handleNext(widgets), error });

    return observable;
  } catch (err) {
    console.error("failed on subscription: ".red, err);
    return undefined;
  }
};
