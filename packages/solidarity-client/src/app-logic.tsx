import { useStoreState } from 'easy-peasy'
import {
  encodeText,
  whatsappText,
  parseNumber,
  volunteerFirstName
} from './services/utils';

export default function useAppLogic() {
  const individual = useStoreState(state => state.individual.data);
  const volunteer = useStoreState(state => state.volunteer.data);
  const tableData = useStoreState(state => state.table.data);
  const popups = useStoreState(state => state.popups.data);

  const createWhatsappLink = (number, textVariables) => {
    if (!number) return false
    return `https://api.whatsapp.com/send?phone=55${number}&text=${textVariables}`;
  };

  const getUserData = ({ user, data, filterBy }) => data.filter((i) => user === i[filterBy])[0]

  const parsedIndividualNumber = parseNumber(individual.phone);
  const urlencodedIndividualText = encodeText(whatsappText({
    volunteer_name: volunteerFirstName(volunteer),
    individual_name: individual.name,
    agent: "Voluntária",
    isVolunteer: false
  }));

  const parsedVolunteerNumber = parseNumber(volunteer.whatsapp);
  const urlencodedVolunteerText = encodeText(whatsappText({
    volunteer_name: volunteerFirstName(volunteer),
    individual_name: individual.name,
    agent: "Voluntária",
    isVolunteer: true
  }));

  const distance = 50;
  const lat = Number(volunteer.latitude);
  const lng = Number(volunteer.longitude);

  return {
    individual,
    volunteer,
    tableData,
    popups,
    lat,
    lng,
    distance,
    createWhatsappLink,
    parsedIndividualNumber,
    urlencodedIndividualText,
    parsedVolunteerNumber,
    urlencodedVolunteerText,
    getUserData
  }
}
