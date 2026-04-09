const { Client } = require('pg');
async function test() {
  const urls = [
    'postgresql://postgres:postgres@localhost:5432/postgres',
    'postgresql://postgres:password@localhost:5432/postgres',
    'postgresql://postgres:root@localhost:5432/postgres',
    'postgresql://localhost:5432/postgres',
    'postgresql://postgres:postgres@localhost:5432/myschool',
    'postgresql://postgres:password@localhost:5432/myschool'
  ];
  for (let url of urls) {
    try {
      const client = new Client({ connectionString: url });
      await client.connect();
      console.log('SUCCESS: ' + url);
      process.exit(0);
    } catch(e) {
      console.log('FAIL: ' + url + ' - ' + e.message);
    }
  }
}
test();
