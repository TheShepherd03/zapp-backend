const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.dwwshxjmunfqtlgdjrkw:m%26%25Mvch3sDyenMufDg%5Eu@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require',
});

client.connect()
  .then(() => {
    console.log('Successfully connected to Postgres!');
    client.end();
  })
  .catch(err => {
    console.error('Connection error:', err.message);
    process.exit(1);
  });
