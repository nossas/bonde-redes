const parseZipcode = (zipcode: string | undefined): string => {
  const regex = /\D/g;
  const str = zipcode ? zipcode.toString() : "";
  return str.replace(regex, "");
};

export default parseZipcode;
