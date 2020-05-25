export const setType = (type: string | null) => {
  switch (type) {
    case "Acolhimento Jurídico":
      return "jurídico";
    case "Acolhimento Terapêutico":
    case "Psicológico":
      return "psicológico";
    case "Acolhimento Terapêutico & Jurídico":
    case "psicológico & Jurídico":
    case "Psicológico & Jurídico":
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

export { default as getGeocoding } from "./geocoding";
