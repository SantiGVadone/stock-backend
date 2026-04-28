import cors, { type CorsOptions } from 'cors'

const allowedOrigins = ['http://localhost:5000', '*']

const corsOptions: CorsOptions = {
  origin: allowedOrigins,
  credentials: true
}

export const corsMiddleware = cors(corsOptions)
