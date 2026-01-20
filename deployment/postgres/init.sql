-- Enable pg_stat_statements extension
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Enable other useful extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";       -- Cryptographic functions
CREATE EXTENSION IF NOT EXISTS "btree_gin";      -- GIN indexes for btree types
CREATE EXTENSION IF NOT EXISTS "btree_gist";     -- GIST indexes for btree types

-- Create a function to reset pg_stat_statements (useful for debugging)
CREATE OR REPLACE FUNCTION reset_query_stats()
RETURNS void AS $$
BEGIN
    PERFORM pg_stat_statements_reset();
END;
$$ LANGUAGE plpgsql;

-- Create a view for easier query analysis
CREATE OR REPLACE VIEW slow_queries AS
SELECT
    query,
    calls,
    ROUND(total_exec_time::numeric, 2) AS total_time_ms,
    ROUND(mean_exec_time::numeric, 2) AS mean_time_ms,
    ROUND(max_exec_time::numeric, 2) AS max_time_ms,
    ROUND((100 * total_exec_time / SUM(total_exec_time) OVER ())::numeric, 2) AS percentage,
    rows
FROM pg_stat_statements
ORDER BY total_exec_time DESC;

-- Create a view for most frequent queries
CREATE OR REPLACE VIEW frequent_queries AS
SELECT
    query,
    calls,
    ROUND(mean_exec_time::numeric, 2) AS mean_time_ms,
    ROUND(total_exec_time::numeric, 2) AS total_time_ms,
    rows
FROM pg_stat_statements
ORDER BY calls DESC;

-- Notification for successful initialization
DO $$
BEGIN
    RAISE NOTICE 'Database initialized with pg_stat_statements and helper views';
END $$;