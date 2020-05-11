// import {
//   updateFormEntries,
//   insertRedeIndividuals
// } from "../../graphql/mutations";
import { Widget } from "../types";
// import log from "signale";

// interface MetaField {
//   uid: string;
//   name: string;
// }

// const cache = [];

const handleNext = (widgets: Widget[]) => async (response: any) => {
  // log.success(`${new Date()}: \nReceiving data on subscription GraphQL API...`);
  // log.success({ response: response.data.form_entries });
  console.log({ response: response.data.form_entries });
  return widgets;
  // const {
  //   data: { form_entries: entries }
  // } = response;

  // entries.forEach((formEntry: any) => {
  //   if (cache.filter((c: any) => c.id !== formEntry.id)) {
  //     cache.push(formEntry);
  //   }
  // });

  // const syncronizedForms = [];
  // const individuals = [];
  // if (cache.length > 0) {
  //   cache.forEach((formEntry: any) => {
  //     const fields = JSON.parse(formEntry.fields);
  //     const widget = widgets.filter(
  //       (w: any) => w.id === formEntry.widget_id
  //     )[0];
  //     if (widget) {
  //       const instance = {};
  //       widget.metadata.form_mapping.forEach((field: MetaField) => {
  //         const acessors = field.name.split(".");
  //         if (acessors.length === 1) {
  //           instance[acessors[0]] = (
  //             fields.filter((f: any) => f.uid === field.uid)[0] || {}
  //           ).value;
  //         } else {
  //           // extra fields
  //           const rootField = acessors[0];
  //           const childField = acessors[1];
  //           const value = {
  //             [childField]: (
  //               fields.filter((f: any) => f.uid === field.uid)[0] || {}
  //             ).value
  //           };

  //           instance[rootField] = { ...instance[rootField], ...value };
  //         }
  //       });

  //       // fields of integration
  //       instance.rede_group_id = widget.group_id;
  //       instance.form_entry_id = formEntry.id;

  //       // store instances
  //       individuals.push(instance);
  //       syncronizedForms.push(formEntry.id);
  //     }
  //   });

  //   // console.log('individuals', individuals)
  //   // Batch insert individuals
  //   console.log("Inserting the new individuals on GraphQL API...");
  //   await insertRedeIndividuals(individuals);
  //   // Batch update syncronized forms
  //   console.log("Updating form_entries syncronized on GraphQL API...");
  //   await updateFormEntries(syncronizedForms);

  //   cache = [];
  //   console.log("Integration is done.");
  // } else {
  //   console.log("No items for integration.");
  // }
};

export default handleNext;
