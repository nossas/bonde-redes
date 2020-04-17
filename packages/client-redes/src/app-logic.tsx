import { useStoreState, useStoreActions } from "easy-peasy";
import { useSession } from "bonde-core-tools";
import { useSettings } from "./services/SettingsProvider";
import {
  whatsappText,
  encodeText,
  dicio,
  parseNumber,
  isJsonString
} from "./services/utils/utils";

export default function useAppLogic(): {
  individual;
  volunteer;
  tableData;
  popups;
  setTable;
  setVolunteer;
  setPopup;
  setIndividual;
  createWhatsappLink: (
    number: string,
    textVariables: string
  ) => string | undefined;
  parsedIndividualNumber: string;
  parsedVolunteerNumber: string;
  volunteer_lat: number;
  volunteer_lng: number;
  distance: number;
  agent: {
    id: number;
  };
  volunteer_text: string;
  individual_text: string;
} {
  const {
    settings: { volunteer_msg, individual_msg, distance }
  } = useSettings();
  const { user: agent } = useSession();

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
    return `https://web.whatsapp.com/send?phone=55${number}&text=${textVariables}`;
  };

  const whatsappDicio = {
    ...dicio("v", { ...volunteer, agent: agent.firstName }),
    ...dicio("p", { ...individual, agent: agent.firstName })
  };

  const volunteer_text = encodeText(whatsappText(volunteer_msg, whatsappDicio));
  const individual_text = encodeText(
    whatsappText(individual_msg, whatsappDicio)
  );

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
    setTable,
    setVolunteer,
    setPopup,
    setIndividual,
    volunteer_lat,
    volunteer_lng,
    distance,
    agent,
    volunteer_text,
    individual_text
  };
}
