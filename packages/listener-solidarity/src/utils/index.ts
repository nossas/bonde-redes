import { User, Ticket } from "../types";

export const organizationsIds = {
  MSR: 360273031591,
  THERAPIST: 360282119532,
  LAWYER: 360269610652,
};

export const setType = (type: string | null) => {
  switch (type) {
    case "Acolhimento Jurídico":
    case " Jurídico":
      return "jurídico";
    case "Acolhimento Terapêutico":
    case "Psicológico":
      return "psicológico";
    case "Acolhimento Terapêutico & Jurídico":
    case "psicológico & Jurídico":
    case "Psicológico & Jurídico":
    case " Psicológico & Jurídico ":
      return "psicológico_e_jurídico";
    default:
      return null;
  }
};

const therapist_widgets = [2760, 16835, 17628];
const lawyer_widgets = [8190, 16838, 17633];

export const getOrganizationType = (id: number): string => {
  if (therapist_widgets.includes(id)) return "THERAPIST";
  if (lawyer_widgets.includes(id)) return "LAWYER";
  return "MSR";
};

export const handleUserError = (entries) => {
  console.log(
    `Integration failed in these form entries ${entries.map(
      (e) => e.external_id
    )}`
  );
  return undefined;
};

export const handleTicketError = ({ requester_id }) => {
  console.log(`Ticket integration failed for this user ${requester_id}`);
  return undefined;
};

export const capitalize = (s: string) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const formatDate = (date: string) => {
  const formatted = new Date(date);
  const dd = String(formatted.getDate()).padStart(2, "0");
  const mm = String(formatted.getMonth() + 1).padStart(2, "0");
  const yyyy = formatted.getFullYear();

  return `${yyyy}-${mm}-${dd}`;
};

export const extractTypeFromSubject = (subject: string) =>
  subject
    .replace(/[-\\^$*+?.()|[\]{}]/g, "")
    .split(" ")[0]
    .toLowerCase();

export const removeDuplicatesBy = (keyFn, array) => {
  var mySet = new Set();
  return array.filter((x) => {
    var key = keyFn(x),
      isNew = !mySet.has(key);
    if (isNew) mySet.add(key);
    return isNew;
  });
};

export { default as getGeocoding } from "./geocoding";
