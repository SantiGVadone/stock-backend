# Usamos una versión liviana de Node
FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos las librerías
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto de tu server Express
EXPOSE 3000

# Comando para arrancar
CMD ["npm", "start"]