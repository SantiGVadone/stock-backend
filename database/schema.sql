-- Esquema de base de datos para Stock App
-- Ejecutar en orden: este archivo crea todas las tablas necesarias

-- ============================================
-- TABLA: users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    superadmin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: stores
-- ============================================
CREATE TABLE IF NOT EXISTS stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(500),
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: users_stores (relación many-to-many con rol)
-- ============================================
CREATE TABLE IF NOT EXISTS users_stores (
    id SERIAL PRIMARY KEY,
    id_user INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    id_store INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    rol VARCHAR(50) NOT NULL DEFAULT 'employee', -- 'owner', 'admin', 'employee'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_user, id_store) -- un usuario no puede tener la misma tienda dos veces
);

-- ============================================
-- TABLA: products
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL DEFAULT 0,
    category VARCHAR(100),
    id_store INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: refresh_tokens (para refresh token rotation)
-- ============================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_store ON products(id_store);
CREATE INDEX IF NOT EXISTS idx_users_stores_user ON users_stores(id_user);
CREATE INDEX IF NOT EXISTS idx_users_stores_store ON users_stores(id_store);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires ON refresh_tokens(expires_at);

-- ============================================
-- TRIGGERS PARA updated_at (opcional, requiere función)
-- ============================================
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--    NEW.updated_at = CURRENT_TIMESTAMP;
--    RETURN NEW;
-- END;
-- $$ language 'plpgsql';
--
-- CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
-- FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
--
-- CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
-- FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
--
-- CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
-- FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();