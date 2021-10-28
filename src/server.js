require("dotenv").config();

const schema = require("./schema");
const { ApolloServer } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
const { getUserId } = require("./utils");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

const prisma = new PrismaClient();

const cors = {
  origin: "*",
  credentials: true
};

const server = new ApolloServer({
  cors,
  schema,
  context: (req) => ({ ...req, prisma, getUserId }),
});

const PORT = process.env.SOSOL_PORT || 7777;

server.listen(
  {
    port: PORT,
  },
  () => console.log(`server has started at http://localhost:${PORT}`)
);
