export const getUserData = (user, data) => {
  const filter = data.filter((i) => user === i.email)
  return filter[0]
}