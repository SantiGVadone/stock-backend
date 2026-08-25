-- ============================================
-- MIGRATION 03: Add email verification columns
-- ============================================
-- Adds email verification support to users table

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS email_verification_expires TIMESTAMP WITH TIME ZONE;

-- Índice para búsqueda rápida por token de verificación
CREATE INDEX IF NOT EXISTS idx_users_email_verification_token ON users(email_verification_token);

-- Comentario: email_verified = TRUE cuando el usuario verifica su email
-- email_verification_token = hash SHA-256 del token enviado por email
-- email_verification_expires = expiración del token (24 horas)