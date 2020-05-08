import User from ".";

const handleUserFields = (user: User) => {
  const { id, user_fields, ...otherFields } = user;
  return {
    user_id: id,
    user_fields,
    ...otherFields,
    ...user_fields
  };
};

export default handleUserFields;
