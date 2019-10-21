import request from 'supertest'
import Server from '../Server'

describe('Server testing', () => {
	const app = new Server()

  test('Health API Request', async () => {
  	const result = await request(app.getInstance()).get('/health')

    expect(result.status).toBe(200)
    expect(result.body).toEqual({ service: 'webhook-activists', status: 'Running' })
  })
})