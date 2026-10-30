-- The admin user itself is created with:  php features/auth/create-admin.php <username>
CREATE TABLE IF NOT EXISTS admin_users (
    id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    language      VARCHAR(5)   NOT NULL DEFAULT 'en',
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);
