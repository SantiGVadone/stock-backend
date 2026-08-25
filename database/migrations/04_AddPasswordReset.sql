-- ============================================
-- MIGRATION 04: Add password reset columns
-- ============================================
-- Adds password reset support to users table

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS reset_password_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS reset_password_expires TIMESTAMP WITH TIME ZONE;

-- Índice para búsqueda rápida por token de reset
CREATE INDEX IF NOT EXISTS idx_users_reset_password_token ON users(reset_password_token);

-- Comentario: reset_password_token = hash SHA-256 del token enviado por email
-- reset_password_expires = expiración del token (1 hora)