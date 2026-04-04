import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import connectDB from './src/config/db.js'
import authRoutes from './src/routes/authRoutes.js'
import recordRoutes from './src/routes/recordRoutes.js'
import dashboardRoutes from './src/routes/dashboardRoutes.js'
import userRoutes from './src/routes/userRoutes.js'
import { errorHandler } from './src/middleware/errorHandler.js'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/records', recordRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/users', userRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'backend is running ' })
})

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

app.use(errorHandler)

const PORT = process.env.PORT

const startServer = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`backend running on port ${PORT}`)
  })
}

startServer()