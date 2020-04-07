import { useStoreState, useStoreActions } from "easy-peasy";
import {
  parseNumber,
  isJsonString
} from "./services/utils";
import { Individual } from "./types/Individual";

export default function useAppLogic(): {
  individual,
  volunteer,
  tableData,
  popups,
  setTable,
  setVolunteer,
  setPopup,
  setIndividual,
  createWhatsappLink: (number: string, textVariables: string) => string | undefined,
  parsedIndividualNumber: string,
  parsedVolunteerNumber: string,
  getUserData,
  volunteer_lat: number,
  volunteer_lng: number,
} {
  const individual = useStoreState(state => state.individual.data);
  const volunteer = useStoreState(state => state.volunteer.data);
  const tableData = useStoreState(state => state.table.data);
  const popups = useStoreState(state => state.popups.data);

  const setTable = useStoreActions(
    (actions: { table: { setTable: () => void } }) => actions.table.setTable
  );
  const setVolunteer = useStoreActions(
    (actions: { volunteer: { setVolunteer: () => void } }) =>
      actions.volunteer.setVolunteer
  );
  const setPopup = useStoreActions(
    (actions: { popups: { setPopup: () => void } }) => actions.popups.setPopup
  );
  const setIndividual = useStoreActions(
    (actions: { individual: { setIndividual: () => void } }) =>
      actions.individual.setIndividual
  );

  const createWhatsappLink = (
    number: string,
    textVariables: string
  ): string | undefined => {
    if (!number) return undefined;
    return `https://api.whatsapp.com/send?phone=55${number}&text=${textVariables}`;
  };

  // TODO: Disable this func, its not used in the main redes app logic
  const getUserData = ({ user, data, filterBy }): Individual =>
    data.filter(i => user === i[filterBy])[0];

  const parsedIndividualNumber = parseNumber(individual.phone);
  const parsedVolunteerNumber = parseNumber(volunteer.whatsapp);

  const parsedCoordinates = isJsonString(volunteer.coordinates)
    ? JSON.parse(volunteer.coordinates)
    : volunteer.coordinates;
  const volunteer_lat = parsedCoordinates && Number(parsedCoordinates.latitude);
  const volunteer_lng =
    parsedCoordinates && Number(parsedCoordinates.longitude);

  return {
    individual,
    volunteer,
    tableData,
    popups,
    createWhatsappLink,
    parsedIndividualNumber,
    parsedVolunteerNumber,
    getUserData,
    setTable,
    setVolunteer,
    setPopup,
    setIndividual,
    volunteer_lat,
    volunteer_lng,
  };
}
