import { useStoreState, useStoreActions } from 'easy-peasy'
import {
  encodeText,
  whatsappText,
  parseNumber
} from './services/utils';

export default function useAppLogic() {
  const individual = useStoreState(state => state.individual.data);
  const volunteer = useStoreState(state => state.volunteer.data);
  const tableData = useStoreState(state => state.table.data);
  const popups = useStoreState(state => state.popups.data);

  const setTable = useStoreActions((actions: any) => actions.table.setTable)
  const setVolunteer = useStoreActions((actions: any) => actions.volunteer.setVolunteer)
  const setPopup = useStoreActions((actions: any) => actions.popups.setPopup);
  const setIndividual = useStoreActions(
    (actions: any) => actions.individual.setIndividual
  );

  const createWhatsappLink = (number, textVariables) => {
    if (!number) return false
    return `https://api.whatsapp.com/send?phone=55${number}&text=${textVariables}`;
  };

  // TODO: Disable this func, its not used in the main redes app logic
  const getUserData = ({ user, data, filterBy }) => data.filter((i) => user === i[filterBy])[0]

  const parsedIndividualNumber = parseNumber(individual.phone);
  const parsedVolunteerNumber = parseNumber(volunteer.whatsapp);

  const distance = 2500;
  const volunteer_lat = Number(volunteer.coordinates && volunteer.coordinates.latitude);
  const volunteer_lng = Number(volunteer.coordinates && volunteer.coordinates.longitude);

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
    encodeText,
    whatsappText,
    volunteer_lat,
    volunteer_lng,
    distance
  }
}
