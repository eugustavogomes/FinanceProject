
DO $$ 
BEGIN  
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'categories' AND column_name = 'user_id') THEN
        ALTER TABLE categories ADD COLUMN user_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'transactions' AND column_name = 'type') THEN
        ALTER TABLE transactions ADD COLUMN type VARCHAR(50) NOT NULL DEFAULT 'Expense';
    END IF;
END $$;


DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'fk_categories_users_user_id') THEN
        ALTER TABLE categories 
        ADD CONSTRAINT fk_categories_users_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'fk_transactions_users_user_id') THEN
        ALTER TABLE transactions 
        ADD CONSTRAINT fk_transactions_users_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'fk_transactions_categories_category_id') THEN
        ALTER TABLE transactions 
        ADD CONSTRAINT fk_transactions_categories_category_id 
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
    END IF;
END $$;
SELECT 'categories' as tabela, 
       column_name as coluna, 
       data_type as tipo 
FROM information_schema.columns 
WHERE table_name = 'categories'
  AND column_name IN ('id', 'name', 'user_id')

UNION ALL

SELECT 'transactions' as tabela,
       column_name as coluna, 
       data_type as tipo
FROM information_schema.columns 
WHERE table_name = 'transactions' 
  AND column_name IN ('id', 'value', 'date', 'description', 'type', 'category_id', 'user_id')

UNION ALL  

SELECT 'users' as tabela,
       column_name as coluna,
       data_type as tipo  
FROM information_schema.columns
WHERE table_name = 'users'
  AND column_name IN ('id', 'email', 'password_hash')
ORDER BY tabela, coluna;