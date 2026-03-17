import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bookingsRouter from './routes/bookings'

const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/bookings', bookingsRouter)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

const port = process.env.PORT ?? 3001
app.listen(port, () => {
  console.log(`Forestince server running on http://localhost:${port}`)
})

export default app
