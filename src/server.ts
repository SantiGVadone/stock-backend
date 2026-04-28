import express from 'express'
import { corsMiddleware } from './config/cors'
import productRoutes from './routes/productos'
const app = express()

//middlewares
app.use(corsMiddleware)
app.use(express.json()) //para que maneje json

app.use('/api/products', productRoutes)

//test

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
