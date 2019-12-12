export const getUserData = ({ user, data, filterBy }) => {
  const filter = data.filter((i) => user === i[filterBy])
  return filter[0]
}

export const encodeText = input => encodeURI(input)