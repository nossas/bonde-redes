import request from 'supertest'
import Server from './Server'

describe('Test the Express server', () => {
  let app: Server
  beforeEach(() => {
    app = new Server()
    app.start()
  })
  test('test endpoint', async () => {
    const response = await request(app.server)
      .post('/test')
    expect(response.status).toBe(200)
  })
})
