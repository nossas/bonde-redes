const setCommunity = <T extends object>(object: T) => {
  const { COMMUNITY_ID } = process.env;
  return { ...object, community_id: Number(COMMUNITY_ID) };
};

export default setCommunity;
