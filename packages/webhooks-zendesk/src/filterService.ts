import debug from 'debug'

const dbg = debug('filterService')

interface Payload {
  event: {
    data: {
      new: {
        service_name: string
        data: object
        created_at: string
      }
    }
  }
}

export enum FILTER_SERVICE_STATUS {
  SUCCESS,
  NOT_DESIRED_SERVICE,
  INVALID_REQUEST
}

export const filterService = (payload: Payload) => {
  try {
    const { event: { data: { new: { service_name: serviceName, data } } } } = payload
    dbg(`received service "${serviceName}"`)
    if (serviceName !== 'mautic-form') {
      dbg(`${serviceName} not desired service`)
      return {
        status: FILTER_SERVICE_STATUS.NOT_DESIRED_SERVICE,
        serviceName
      }
    }
    return {
      status: FILTER_SERVICE_STATUS.SUCCESS,
      data
    }
  } catch (e) {
    dbg(e)
    return {
      status: FILTER_SERVICE_STATUS.INVALID_REQUEST
    }
  }
}
