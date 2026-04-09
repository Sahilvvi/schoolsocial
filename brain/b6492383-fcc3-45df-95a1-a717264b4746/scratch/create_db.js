
import pg from 'pg';
const { Client } = pg;

async function createDb() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'password',
    port: 5432,
  });

  try {
    await client.connect();
    await client.query('CREATE DATABASE myschool');
    console.log("Database 'myschool' created successfully.");
  } catch (err) {
    if (err.code === '42P04') {
      console.log("Database 'myschool' already exists.");
    } else {
      console.error("Failed to create database:", err);
    }
  } finally {
    await client.end();
  }
}

createDb();
