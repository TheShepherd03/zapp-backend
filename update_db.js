require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "resetToken" TEXT, ADD COLUMN IF NOT EXISTS "resetTokenExpiry" TIMESTAMP(3);')
  .then(() => { console.log('DB Updated'); process.exit(0); })
  .catch(e => { console.error('Error:', e); process.exit(1); });
