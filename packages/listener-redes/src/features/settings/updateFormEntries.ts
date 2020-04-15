import gql from "graphql-tag";
import { client as GraphQLAPI } from "../../graphql";

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

const updateFormEntries = async (forms: number[]): Promise<any> => {
  try {
    const {
      data: {
        update_form_entries: { returning: formEntries }
      }
    } = await GraphQLAPI.mutate({
      mutation: FORM_ENTRIES_MUTATION,
      variables: { forms }
    });

    console.log("Successfully updated these form_entries status", forms);

    return formEntries;
  } catch (err) {
    console.error("failed on update form entries: ".red, err);
    return undefined;
  }
};

export default updateFormEntries;
