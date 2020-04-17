export const encodeText = (input: string): string => encodeURIComponent(input);

export const parseNumber = (input: string): string => input.replace(/\D/g, "");

/**
 * @param name Inital letter that will agreggate with propriety name
 * @param obj Object that coitains all key/value pairs
 * @return {"VFIRST_NAME": Test, "VEMAIL: "teste@nossas.org"}
 */
export const dicio = (name: string, obj: object) =>
  Object.keys(obj).reduce((acumulator, k) => {
    const key = k !== "agent" ? name + k : k;
    return {
      ...acumulator,
      [key.toUpperCase()]: obj[k]
    };
  }, {});

/**
 * @param msg Message set in community_settings
 * @param dicio Dicionary made to transpile msg using volunteer/individual data
 * @return {string}
 */
export const whatsappText = (msg = "", dicio): string => {
  const re = new RegExp(Object.keys(dicio).join("|"), "gi");

  return msg.replace(re, matched => dicio[matched]);
};

export const isJsonString = str => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
