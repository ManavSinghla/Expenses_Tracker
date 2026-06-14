import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

import prisma from './lib/prisma.js'

const app = express()
const PORT = process.env.PORT || 3001

// ── Middleware ──────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── Health Check ───────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: 'connected' 
    })
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message 
    })
  }
})

// ── 404 Handler ────────────────────────────────────────────────
app.use('/api/{*path}', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ── Error Handler ──────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server Error:', err)
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// ── Start Server ───────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 FairShare API running on http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

export { app, prisma }
