import Base from './Base'
import { Requester } from '../countTickets'

interface UpdateRequesterFieldsRequest extends Requester {
  id: number
}

class UpdateRequesterFields extends Base {
  constructor () {
    super('UpdateRequesterFields')
  }

  start = async (requestData: UpdateRequesterFieldsRequest[]) => {
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
    return this.put(`users/update_many`, data)
  }
}

export default UpdateRequesterFields
