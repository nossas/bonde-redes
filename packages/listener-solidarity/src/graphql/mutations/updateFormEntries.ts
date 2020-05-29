import gql from "graphql-tag";
import { client as GraphQLAPI } from "../";
import dbg from "../../dbg";

const log = dbg.extend("updateFormEntries");

const FORM_ENTRIES_MUTATION = gql`
  mutation update_form_entries($forms: [Int!]) {
    update_form_entries(
      _set: { rede_syncronized: true }
      where: { id: { _in: $forms } }
    ) {
      returning {
        id
      }
    }
  }
`;

// type Response = {
//   data: {
//     update_form_entries?: {
//       returning: Array<{
//         id;
//         updated_at;
//       }>;
//     };
//     errors?: Array<any>;
//   };
// };

const updateFormEntries = async (forms: number[]) => {
  try {
    const res = await GraphQLAPI.mutate({
      mutation: FORM_ENTRIES_MUTATION,
      variables: { forms }
    });

    if (res && res.data && res.data.errors) {
      log(`failed on update form entries: ${forms}`.red, res.data.errors);
      return undefined;
    }

    const {
      data: {
        update_form_entries: { returning: formEntries }
      }
    } = res;

    return formEntries;
  } catch (err) {
    log(`failed on update form entries: ${forms}`.red, err);
    return undefined;
  }
};

export default updateFormEntries;
