const server = require('./server')

const createToken = require('../auth/utils/createToken')

const request = require('supertest')

describe('server endpoints test', () => {

	describe('GET /api/jokes', () => {
		it('should be a protected route', async () => {
			const user = { username: "matthew", password: "1234" }
			const token = createToken(user)

			const response = await request(server).get('/api/jokes')

			expect(response.status).toBe(400)

			const secondResponse = await request(server).get('/api/jokes')
				.set('authorization', token)

			expect(secondResponse.status).toBe(200)
		})

		it('should return  json', async () => {
			const user = { username: "matthew", password: "1234" }
			const token = createToken(user)

			const response = await request(server).get('/api/jokes')
				.set('authorization', token)

			expect(response.type).toMatch(/json/i)
		})
	})
})
