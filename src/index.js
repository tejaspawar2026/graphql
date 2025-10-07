import cors from "cors";
import express, { json } from "express";
import { ApolloServer } from "@apollo/server";
import pool from "./initializers/db.js";
import { typeDefs } from "./graphql/typedefs/index.js";
import { resolvers } from "./graphql/resolvers/index.js";
import context from "./graphql/context.js";
import dotenv from 'dotenv';

dotenv.config();

const Headers = globalThis.Headers;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
];

const server = new ApolloServer({ typeDefs, resolvers, context });

await server.start();

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(json());

async function testDBConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Database connected successfully!");
    connection.release();
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

await testDBConnection();

app.use("/graphql", async (req, res) => {
  const response = await server.executeHTTPGraphQLRequest({
    httpGraphQLRequest: {
      method: req.method,
      headers: new Headers(req.headers),
      search: req.url.split("?")[1] ?? "",
      body: req.body,
    },
    context: async () => ({ db: pool }),
  });

  res.status(response.status || 200);

  response.headers?.forEach((value, key) => {
    res.setHeader(key, value);
  });

  res.send(response.body.string);
});

app.listen(process.env.PORT, () => {
  console.log("Server running at http://localhost:3000/graphql");
});