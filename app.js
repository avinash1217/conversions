const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const graphQlSchema = require("./graphql/schema/index");
const graphQlResolver = require("./graphql/resolvers/index");
const authMiddleware = require('./middlewares/auth');
const app = express();
const mongoose = require("mongoose");
const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  max: 30,
  windowMs: 1 * 60 * 1000 //1 minute
});

app.use(bodyParser.json());

app.use(authMiddleware);

app.use(rateLimiter)

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolver,
    graphiql: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.01mvu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
