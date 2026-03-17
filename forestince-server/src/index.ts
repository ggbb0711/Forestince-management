import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bookingsRouter from './routes/bookings'
import facilitiesRouter from './routes/facilities'
import dashboardRouter from './routes/dashboard'
import reportsRouter from './routes/reports'
import { errorHandler } from './middleware/errorHandler'

const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/bookings', bookingsRouter)
app.use('/api/facilities', facilitiesRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/reports', reportsRouter)

app.get('/health', (_req, res) => {
  res.json({ payload: { status: 'ok' }, message: 'Server is healthy', isOk: true })
})

app.use(errorHandler)

const port = process.env.PORT ?? 3001
app.listen(port, () => {
  console.log(`Forestince server running on http://localhost:${port}`)
})

export default app
