import { createRequire } from 'module'
import jsonServer from 'json-server'
import cors from 'cors'
import { readFileSync } from 'fs'

const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults({ noCors: true })

// Allow all origins for MVP
server.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

server.use(middlewares)
server.use(router)

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`)
})
