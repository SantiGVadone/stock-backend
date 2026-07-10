#!/usr/bin/env node
// Script para ejecutar la migración de base de datos
// Uso: node run-migration.js

import pg from 'pg'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config()

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

async function runMigration() {
  const schemaPath = path.join(__dirname, 'database', 'schema.sql')
  const sql = fs.readFileSync(schemaPath, 'utf-8')
  
  const client = await pool.connect()
  
  try {
    console.log('🔄 Ejecutando migración de base de datos...')
    await client.query(sql)
    console.log('✅ Migración completada exitosamente')
    console.log('Tablas creadas: users, stores, users_stores, products')
  } catch (error) {
    console.error('❌ Error en migración:', error.message)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

runMigration()