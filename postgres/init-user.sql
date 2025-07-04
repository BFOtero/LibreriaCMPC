CREATE USER cmpcUser WITH PASSWORD 'cmpcUserPassword';

GRANT CONNECT ON DATABASE books TO cmpcUser;

\connect books;

GRANT USAGE ON SCHEMA public TO cmpcUser;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO cmpcUser;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO cmpcUser;
