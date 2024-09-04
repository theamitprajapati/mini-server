const request = require("supertest")
const {LoginTest} = require("./auth.test.data")

const HOST = 'http://localhost:8002'

describe('AUTH', () => {
    it('Login API:', async () => {
      const res = await request(HOST)
        .post('/api/auth/login')
        .send(LoginTest)
        console.log(res.body.data.access_token)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('data')
    })
  })

