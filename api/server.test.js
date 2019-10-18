const server = require('./server')

const createToken = require('../auth/utils/createToken')

const request = require('supertest')

const db = require('../database/dbConfig')

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

		it('should return json', async () => {
			const user = { username: "matthew", password: "1234" }
			const token = createToken(user)

			const response = await request(server).get('/api/jokes')
				.set('authorization', token)

			expect(response.type).toMatch(/json/i)
		})
	})

	describe('POST /api/auth/register', () => {

		beforeEach(async () => {
			await db('users').truncate();
		});

		it('should add player to db', async () => {
			const initial = await db('users')
			expect(initial).toHaveLength(0)


			const user = await request(server)
			.post('/api/auth/register')
			.send({ username: 'matthew', password: '123' })

			const result = await db('users')
			expect(result).toHaveLength(1)
		})

		it('should send status 400 if proper field are not sent', async () => {
			const user = await request(server)
			.post('/api/auth/register')
			.send({ name: 'matthew', password: '123' })

			expect(user.status).toBe(400)
			expect(user.body).toEqual({message: 'username and password are required fields'})
		})

		describe('POST /api/auth/login',() => {

			beforeEach(async () => {
				await db('users').truncate();
			});
			it('should return status 401 if username and password are not valid', async () => {
			
			const login = await request(server)
			.post('/api/auth/login')
			.send({ username: 'fail', password: 'fail' })

			expect(login.status).toBe(401)
			})

			it('should return message "You shall not pass!!" if username and password are not valid', async () => {
			
				const login = await request(server)
				.post('/api/auth/login')
				.send({ username: 'fail', password: 'fail' })
	
				expect(login.body).toEqual({message: "You shall not pass!!"})
				})

			it('should return  "message": "Welcome username!", if username and password are valid', async () => {
				const user = await request(server)
				.post('/api/auth/register')
				.send({ username: 'matthew', password: '123' })

				const login = await request(server)
				.post('/api/auth/login')
				.send({ username: 'matthew', password: '123' })
	
				expect(login.body.message).toEqual(`Welcome matthew!`)
				})
		})
	})
})
