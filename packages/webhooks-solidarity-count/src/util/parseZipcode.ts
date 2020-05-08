const parseZipcode = zipcode => {
  const regex = /\D/g;
  const str = zipcode ? zipcode.toString() : "";
  return str.replace(regex, "");
};

export default parseZipcode;
