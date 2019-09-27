import Base from './Base'
import { Requester } from '../interfaces/Requester'
import dbg from './dbg'

interface UpdateRequesterFieldsRequest extends Requester {
  id: number
}

const updateRequesterFields = (requestData: UpdateRequesterFieldsRequest[]) => {
  const data = {
    users: requestData.map(i => {
      const {id, ...customFieldsWithoutId} = i
      return {
        id,
        user_fields: {
          ...customFieldsWithoutId
        }
      }
    })
  }
  return Base.put(`users/update_many`, dbg.extend('updateRequesterFields'), data)
}

export default updateRequesterFields
