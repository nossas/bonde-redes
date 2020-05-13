import { status_acolhimento_values, ticketCustomFields, customFields } from ".";
import dicio from "./dicio";

export interface WithCustomFields {
  custom_fields: ticketCustomFields;
}

const handleCustomFields = <T extends WithCustomFields>(
  ticket: T
): T & customFields => {
  const newTicket = { ...ticket };
  newTicket.custom_fields.forEach(i => {
    if (dicio[i.id]) {
      if (i.id === 360014379412) {
        newTicket[dicio[i.id]] = i.value as status_acolhimento_values;
      } else {
        newTicket[dicio[i.id]] = i.value;
      }
    }
  });

  return newTicket as T & customFields;
};

export default handleCustomFields;
