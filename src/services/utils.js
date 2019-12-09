export const getUserData = (user, data, field) => {
  const filter = data.filter((i) => user === i[field])
  return filter[0]
}