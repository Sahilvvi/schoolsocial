
console.log("DATABASE_URL:", process.env.DATABASE_URL);
if (!process.env.DATABASE_URL) {
  console.error("Missing DATABASE_URL");
} else {
  console.log("Found DATABASE_URL");
}
