import fastify from 'fastify'
import service from '.'

describe('test service', () => {
  const app = fastify()

  beforeAll(async () => {
    await app.register(service).ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('test route /', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/'
    })
    expect(response.statusCode).toBe(200)
    expect(response.json()).toStrictEqual({
      path: '/'
    })
  })
})
