// Creates .env with a random AUTH_SECRET and a local demo admin login (only if .env does not exist).
import { existsSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";

if (existsSync(".env")) {
  console.log(".env already exists - leaving it unchanged.");
} else {
  writeFileSync(
    ".env",
    [
      'DATABASE_URL="file:./dev.db"',
      `AUTH_SECRET="${randomBytes(32).toString("hex")}"`,
      'ADMIN_EMAIL="admin@veyra.test"',
      'ADMIN_PASSWORD="ChangeMe123!"',
      "",
    ].join("\n")
  );
  console.log(".env created.");
  console.log("Local demo admin login -> email: admin@veyra.test  password: ChangeMe123!");
}
