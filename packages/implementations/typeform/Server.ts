import Base from 'bonde-webhook-core'

class Client extends Base.Client {
  constructor () {
    super({
      endpoint: 'etc'
    }, 'typeform')
  }
}
