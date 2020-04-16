export const encodeText = (input: string): string => encodeURIComponent(input);

export const parseNumber = (input: string): string => input.replace(/\D/g, "");

export const dicio = (name: string, obj: object) =>
  Object.keys(obj).reduce((acumulator, k) => {
    const key = k !== "agent" ? name + k : k;
    return {
      ...acumulator,
      [key.toUpperCase()]: obj[k]
    };
  }, {});

export const whatsappText = (msg = "", dicio): string => {
  const re = new RegExp(Object.keys(dicio).join("|"), "gi");

  return msg.replace(re, matched => dicio[matched]);
};

export const emailValidation = (): RegExp =>
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

export const redirectToLogin = (): void => {
  const loginUrl =
    process.env.REACT_APP_LOGIN_URL ||
    "http://admin-canary.bonde.devel:5002/auth/login";
  window.location.href = `${loginUrl}?next=${window.location.href}`;
};

export const isJsonString = str => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
