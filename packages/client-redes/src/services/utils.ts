export const encodeText = (input: string): string => encodeURIComponent(input);

export const parseNumber = (input: string): string => input.replace(/\D/g, "");

const replaceAll = (str,mapObj) => {
  var re = new RegExp(Object.keys(mapObj).join("|"),"gi");

  return str.replace(re, function(matched){
    return mapObj[matched];
  });
}

export const whatsappText = ({
  volunteer_name,
  individual_name,
  agent,
  isVolunteer,
  volunteer_email = ""
}): string => {
  const mapObj = { INAME: individual_name, VNAME: volunteer_name, VEMAIL: volunteer_email, AGENT: agent };

  if (isVolunteer)
    return replaceAll(volunteer_msg)
  return replaceAll(individual_msg)
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
