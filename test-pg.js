const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function test() {
  const { rows } = await pool.query('SELECT id, LENGTH("coverImage") as cover_len, LENGTH(content) as content_len FROM "Post"');
  console.log(rows);
  process.exit(0);
}
test();
