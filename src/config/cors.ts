import cors, { type CorsOptions } from 'cors'

// Definimos los orígenes permitidos
const allowedOrigins = [
  'http://localhost:5000',
  'http://192.168.1.39:5000',
  'http://192.168.1.39:3000',
  /^http:\/\/192\.168\.1\.\d{1,3}:5000$/
]

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Si no hay origen (como apps móviles o Postman) o está en la lista, permitimos
    if (
      !origin ||
      allowedOrigins.some((allowed) =>
        typeof allowed === 'string' ? allowed === origin : allowed.test(origin)
      )
    ) {
      callback(null, true)
    } else {
      callback(new Error('No permitido por CORS'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}

export const corsMiddleware = cors(corsOptions)
