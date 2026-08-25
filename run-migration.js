#!/usr/bin/env node
// Script para ejecutar la migración de base de datos
// Uso: node run-migration.js

import pg from 'pg'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

async function runMigration() {
  const migrationsDir = path.join(__dirname, 'database', 'migrations')
  const schemaPath = path.join(__dirname, 'database', 'schema.sql')

  const client = await pool.connect()

  try {
    console.log('🔄 Ejecutando migraciones de base de datos...')

    // Ejecutar archivos de migración en orden alfabético
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort()

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file)
      const sql = fs.readFileSync(filePath, 'utf-8')
      console.log(`  📄 Ejecutando ${file}...`)
      await client.query(sql)
    }

    // Ejecutar schema.sql (crea tablas si no existen)
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8')
    console.log(`  📄 Ejecutando schema.sql...`)
    await client.query(schemaSql)

    console.log('✅ Migración completada exitosamente')
  } catch (error) {
    console.error('❌ Error en migración:', error.message)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

runMigration()
