import User from ".";

const handleUserFields = (user: User) => {
  const { id, user_fields, ...otherFields } = user;
  return {
    ...otherFields,
    ...user_fields,
    user_id: id
  };
};

export default handleUserFields;
