import db from "../initializers/db.js";

export default async function context() {
  return { db };
}