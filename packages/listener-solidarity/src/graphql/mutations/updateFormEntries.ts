import gql from "graphql-tag";
import { client as GraphQLAPI } from "../";
import dbg from "../../dbg";
import formEntries from "../subscriptions/formEntries";

const log = dbg.extend("updateFormEntries");

const FORM_ENTRIES_MUTATION = gql`
  mutation update_form_entries($forms: [Int!]) {
    update_form_entries(
      _set: { rede_syncronized: true }
      where: { id: { _in: $forms } }
    ) {
      returning {
        id
        updated_at
      }
    }
  }
`;

type Response = {
  data: {
    update_form_entries?: {
      returning: Array<{
        id;
        updated_at;
      }>;
    };
    errors?: Array<any>;
  };
};

const updateFormEntries = async (forms: number[]): Promise<Response> => {
  try {
    const res = await GraphQLAPI.mutate({
      mutation: FORM_ENTRIES_MUTATION,
      variables: { forms },
    });

    if (res && res.data && res.data.errors) {
      return Promise.reject(res.data.errors);
    }

    const {
      data: {
        update_form_entries: { returning: formEntries },
      },
    } = res;

    return Promise.resolve(formEntries);
  } catch (err) {
    log("failed on update form entries: ".red, err);
    return Promise.reject(err);
  }
};

export default updateFormEntries;
